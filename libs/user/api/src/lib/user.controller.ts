import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthorGuard, JwtAuthGuard } from './guards';
import { Public } from './guards/public.decorator';
import { IUser } from './interfaces/IUser';
import { IRequestInfo } from './request-info-middleware';
import { ChangePasswordDto, UpdateEmailDto, UpdateUserDto } from './user.dto';
import { User } from './user.model';
import { UserReturnType, UserService } from './user.service';

@Controller('user')
@UseGuards(AuthorGuard)
@UseGuards(JwtAuthGuard)
export class UserController {

  constructor(private userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: IRequestInfo): Promise<Omit<User, 'password' | 'email' | 'recoverCode'> | null> {
    return await this.userService.getUserProfile(req.user?.id || '');
  }

  @Post('edit/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
      @Body() data: UpdateUserDto
  ): Promise<UserReturnType> {
    return await this.userService.updateUser(id, data);
  }

  @Post('update-email/:id')
  @HttpCode(HttpStatus.OK)
  async updateEmail(
    @Param('id') id: string,
      @Body() data: UpdateEmailDto,
      @Req() req: IRequestInfo
  ): Promise<IUser['emailHistory']> {
    return await this.userService.updateEmail(id, data, req.userData);
  }

  @Get('change-email/:id/:code')
  @Public()
  @HttpCode(HttpStatus.OK)
  async changeEmail(
    @Param('id') id: string,
      @Param('code') code: string,
      @Req() req: IRequestInfo
  ): Promise<{ title: string; message: string }> {
    return await this.userService.confirmChangeEmail(id, code, req.userData);
  }

  @Delete('change-email/:id/:code')
  @HttpCode(HttpStatus.OK)
  async changeEmailDelete(
    @Param('id') id: string,
      @Param('code') code: string
  ): Promise<void> {
    await this.userService.deleteChangeEmail(id, code);
  }

  @Get('revert-change-email/:id/:code')
  @Public()
  @HttpCode(HttpStatus.OK)
  async revertChangeEmail(
    @Param('id') id: string,
      @Param('code') code: string
  ): Promise<void> {
    await this.userService.revertChangeEmail(id, code);
  }

  @Post('change-password/:id')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
      @Body() data: ChangePasswordDto,
      @Req() req: IRequestInfo
  ): Promise<IUser['passwordHistory']> {
    return await this.userService.changePasswordStart(id, data, req.userData);
  }

  @Get('change-password/:id/:code')
  @HttpCode(HttpStatus.OK)
  async confirmChangePassword(
    @Param('id') id: string,
      @Param('code') code: string,
      @Req() req: IRequestInfo
  ): Promise<{ title: string; message: string }> {
    await this.userService.changePasswordComplete(id, code, req.userData);
    return {
      title: 'Password Changed',
      message: 'Your password has been successfully changed.',
    };
  }

  @Delete('change-password/:id')
  @HttpCode(HttpStatus.OK)
  async cancelChangePassword(
    @Param('id') id: string,
  ): Promise<void> {
    await this.userService.deleteChangePassword(id);
  }
}
