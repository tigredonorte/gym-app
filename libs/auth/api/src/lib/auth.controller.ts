import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, ValidationPipe } from '@nestjs/common';
import { User } from '../../../../../apps/gym-api/src/user/user.model';
import { CheckEmailDto, ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, SignupDto, changePasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { IRequestInfo } from './request-info-middleware';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto, @Req() req: IRequestInfo) {
    return this.authService.login(data, req.userData);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() data: SignupDto): Promise<User> {
    return this.authService.signup(data);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body(new ValidationPipe()) data: ForgotPasswordDto, @Req() req: IRequestInfo) {
    return this.authService.forgotPassword(data, req.userData);
  }

  @Post('confirm-recover')
  @HttpCode(HttpStatus.OK)
  async confirmRecover(@Body(new ValidationPipe()) data: ConfirmRecoverPasswordDto) {
    return this.authService.confirmRecover(data);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body(new ValidationPipe()) data: changePasswordDto) {
    return this.authService.changePassword(data);
  }

  @Post('checkEmail')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Body(new ValidationPipe()) data: CheckEmailDto) {
    const result = await this.authService.checkEmail(data);
    if (result) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }
    return {};
  }

}
