import { JwtAuthGuard, User } from '@gym-app/user/api';
import { IRequestInfoDto } from '@gym-app/user/types';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req, UseGuards,
  ValidationPipe
} from '@nestjs/common';
import {
  CheckEmailDto,
  ConfirmRecoverPasswordDto,
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  SignupDto,
  changePasswordDto
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto, @Req() req: IRequestInfoDto) {
    return this.authService.login(data, req.userData);
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async refreshToken(
    @Headers('authorization') token: string,
      @Req() req: IRequestInfoDto
  ): Promise<{ token: string }> {
    return this.authService.refreshToken(req.user?.id || '', token, req.userData);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() data: LogoutDto, @Req() req: IRequestInfoDto) {
    return this.authService.logout(data, req.userData);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() data: SignupDto, @Req() req: IRequestInfoDto): Promise<Omit<User, 'password'>> {
    return this.authService.signup(data, req.userData);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body(new ValidationPipe()) data: ForgotPasswordDto, @Req() req: IRequestInfoDto) {
    return this.authService.forgotPassword(data, req.userData);
  }

  @Post('confirm-recover')
  @HttpCode(HttpStatus.OK)
  async confirmRecover(@Body(new ValidationPipe()) data: ConfirmRecoverPasswordDto) {
    return this.authService.confirmRecover(data);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body(new ValidationPipe()) data: changePasswordDto, @Req() req: IRequestInfoDto) {
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
