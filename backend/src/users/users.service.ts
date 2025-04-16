import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserDocument } from './user.schema';

type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(registerUserDto: RegisterUserDto): Promise<ServiceResponse<User>> {
    try {
      const { name, email, password } = registerUserDto;
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      const hashed = await bcrypt.hash(password, 10);
      const createdUser = new this.userModel({
        name,
        email,
        password: hashed,
        role: 'user',
      });

      const user = await createdUser.save();
      return { success: true, data: user };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error creating user' };
    }
  }

  async findByEmail(email: string): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: 'Error fetching user by email' };
    }
  }

  async findById(id: string): Promise<ServiceResponse<User>> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: 'Error fetching user by ID' };
    }
  }
}
