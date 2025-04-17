import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MailService } from './mail.service';
import { Otp, OtpSchema } from './otp.schema';
import { JwtCookieAuthGuard } from './jwt-cookie-auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],
  providers: [AuthService, MailService, JwtCookieAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtCookieAuthGuard],
})
export class AuthModule {}
