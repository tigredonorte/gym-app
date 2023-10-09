import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, SignupDto } from './auth.dto';

@Controller('auth')
export class AuthController {

  @Post('login')
  async login(@Body(new ValidationPipe()) loginData: LoginDto) {
    return `login ${loginData.email} ${loginData.password}`;
  }

  @Post('signup')
  async signup(@Body(new ValidationPipe()) signupData: SignupDto) {
    return `signup ${signupData.email} ${signupData.password}`;
  }

  @Post('forgot-password')
  async forgotPassword(@Body(new ValidationPipe()) forgotPasswordData: ForgotPasswordDto) {
    return `forgotPasswordData ${forgotPasswordData.email}`;
  }

  @Post('confirm-recover')
  async confirmRecover(@Body(new ValidationPipe()) confirmRecoverData: ConfirmRecoverPasswordDto) {
    return `confirmRecover ${confirmRecoverData.email}`;
  }
}
