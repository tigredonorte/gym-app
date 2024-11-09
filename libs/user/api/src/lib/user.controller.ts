import { IRequestInfoDto, UserReturnType } from '@gym-app/user/types';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { AuthGuard } from 'nest-keycloak-connect';
import * as path from 'path';
// import { PaginationResult, SessionService } from './session';
import { ChangeEmailDto, ChangePasswordDto, UpdateUserDto } from './user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    // private sessionService: SessionService
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMe( @Param('id') id: string): Promise<Omit<User, '_id' | 'password' | 'email' | 'recoverCode'> | null> {
    return await this.userService.getUserProfile(id);
  }

  @Post(':id/edit')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
      @Body() data: UpdateUserDto
  ): Promise<UserReturnType> {
    return await this.userService.updateUser(id, data);
  }

  // @Get(':id/session')
  // @HttpCode(HttpStatus.OK)
  // async getSessionInfo(
  //   @Param('id') id: string,
  // ): Promise<ISession[]> {
  //   return await this.sessionService.getUserSession(id);
  // }

  // @Get(':id/access')
  // @HttpCode(HttpStatus.OK)
  // async getAccessInfo(
  //   @Param('id') id: string,
  //     @Query('page') page = 1,
  //     @Query('limit') limit = 10,
  // ): Promise<PaginationResult<IAccessLog[]>> {
  //   const offset = (page - 1) * limit;
  //   return await this.sessionService.getAccessInfo(id, offset, limit);
  // }

  // @Post(':id/logoutDevice')
  // @HttpCode(HttpStatus.OK)
  // async logoutDevice(
  //   @Body() data: LogoutDeviceDto,
  //     @Req() req: IRequestInfoWithUser
  // ): Promise<void> {
  //   await this.sessionService.logoutDevice(data.sessionId, data.accessId, req.user);
  // }

  @Post(':id/upload-avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
          const userId = req.params['id'];
          const userDir = path.join(__dirname, 'uploads', 'avatars', userId);

          fs.mkdir(userDir, { recursive: true }, (err) => {
            callback(err, userDir);
          });
        },
        filename: (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
          const extension = file.mimetype.split('/')[1];
          callback(null, `avatar.${extension}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File,
  ): Promise<UserReturnType> {
    if (!file) {
      throw new Error('File is missing');
    }

    const avatarUrl = `uploads/avatars/${id}/${file.filename}`;
    return await this.userService.updateAvatar(id, avatarUrl);
  }

  @Post(':id/change-email')
  @HttpCode(HttpStatus.OK)
  async changeEmail(
    @Param('id') id: string,
      @Body() data: ChangeEmailDto,
      @Req() req: Request & IRequestInfoDto
  ): Promise<boolean> {
    return await this.userService.changeEmail(id, data, req.userData);
  }

  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
      @Body() data: ChangePasswordDto,
      @Req() req: IRequestInfoDto
  ): Promise<boolean> {
    return await this.userService.changePassword(id, data, req.userData);
  }
}
