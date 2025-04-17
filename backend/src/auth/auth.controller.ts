import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';
import { JwtCookieAuthGuard } from './jwt-cookie-auth.guard';


interface AuthRequest extends Request {
  user: any; // or your actual user type
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() body: { email: string }) {
    return this.authService.registerWithOtp(body.email);
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(
    @Body()
    body: {
      email: string;
      otp: string;
      password: string;
      name: string;
    },
  ) {
    return this.authService.verifyOtpAndCompleteRegistration(
      body.email,
      body.otp,
      body.password,
      body.name,
    );
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const valid = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!valid.success) {
      return res.status(401).json({ success: false, error: valid.error });
    }
    return this.authService.loginWithCookie(valid.data._doc, res);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return { success: true, message: 'Logged out successfully' };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('profile')
  @HttpCode(200)
  getProfile(@Req() req: AuthRequest) {
    return { success: true, data: req.user };
  }
}
