import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { User } from '../user/user.model';
import { ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, SignupDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(new ValidationPipe()) loginData: LoginDto) {
    return `login ${loginData.email} ${loginData.password}`;
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<User> {
    return this.authService.signup(signupDto);
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
