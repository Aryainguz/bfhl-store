import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express'; // Import Response from express
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { UserRole } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { MailService } from './mail.service'; // Integrated directly in auth module
import { Otp, OtpDocument } from './otp.schema';

type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ServiceResponse<any>> {
    const response = await this.usersService.findByEmail(email);
    if (!response.success || !response.data) {
      return { success: false, error: 'User not found' };
    }
    const user = response.data;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, error: 'Invalid credentials' };
    }
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  }

  async loginWithCookie(
    user: any,
    res: Response,
  ): Promise<ServiceResponse<any>> {
    const payload = { email: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // console.log(user.email)

    const userdata = await this.usersService.findByEmail(user.email);

    // console.log(userdata)

    // set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { success: true, data: userdata };
  }

  async registerWithOtp(email: string): Promise<ServiceResponse<string>> {
    const userResponse = await this.usersService.findByEmail(email);
    if (userResponse.success && userResponse.data) {
      return { success: false, error: 'Email is already registered' };
    }
    const otp = crypto.randomInt(100000, 1000000).toString();

    try {
      await this.otpModel.create({ email, code: otp });
    } catch (err) {
      return { success: false, error: 'Failed to store OTP' };
    }

    try {
      await this.mailService.sendOtp(email, otp);
    } catch (err) {
      return { success: false, error: 'Failed to send OTP email' };
    }
    return { success: true, data: 'OTP has been sent to your email address.' };
  }

  async verifyOtpAndCompleteRegistration(
    email: string,
    otp: string,
    password: string,
    name: string,
  ): Promise<ServiceResponse<{ message: string; user: any }>> {
    const storedOtpDoc = await this.otpModel
      .findOne({ email, code: otp })
      .exec();
    if (!storedOtpDoc) {
      return { success: false, error: 'Invalid or expired OTP' };
    }
    // Remove OTP after successful verification
    await storedOtpDoc.deleteOne();

    let newUser;
    try {
      newUser = await this.usersService.create({
        name,
        email,
        password,
        role: 'user' as UserRole,
      });
    } catch (error) {
      return { success: false, error: 'Failed to register user' };
    }
    return {
      success: true,
      data: { message: 'Registration successful', user: newUser },
    };
  }
}
