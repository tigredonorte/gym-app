import { CreatedUser } from '@gym-app/keycloak';
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
import { AuthGuard, Public } from 'nest-keycloak-connect';
import {
  CheckEmailDto,
  ConfirmRecoverPasswordDto,
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  SignupDto,
  changePasswordDto
} from './auth.dto';
import { AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async refreshToken(@Body() data: RefreshTokenDto): Promise<{ token: string }> {
    return this.authService.refreshToken(data.userRefreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(
  @Body() data: LogoutDto,
    @Req() req: IRequestInfoDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.authService.logout(data, authHeader, req.userData);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() data: SignupDto, @Req() req: IRequestInfoDto): Promise<CreatedUser> {
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
  async changePassword(
  @Body(new ValidationPipe()) data: changePasswordDto,
    @Req() req: IRequestInfoDto
  ) {
    return this.authService.changePassword(data, req.userData);
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
