import { User } from '@gym-app/user/api';
import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, ValidationPipe } from '@nestjs/common';
import { CheckEmailDto, ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, LogoutDto, SignupDto, changePasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { IRequestInfo } from '@gym-app/user/api';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto, @Req() req: IRequestInfo) {
    return this.authService.login(data, req.userData);
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: IRequestInfo): Promise<{ token: string }> {
    return this.authService.refreshToken(req.user?.id || '');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() data: LogoutDto, @Req() req: IRequestInfo) {
    return this.authService.logout(data, req.userData);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() data: SignupDto, @Req() req: IRequestInfo): Promise<Omit<User, 'password'>> {
    return this.authService.signup(data, req.userData);
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
  async changePassword(@Body(new ValidationPipe()) data: changePasswordDto, @Req() req: IRequestInfo) {
    return this.authService.changePassword(data, req.ip);
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
