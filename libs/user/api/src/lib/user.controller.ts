import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorGuard, JwtAuthGuard } from './guards';
import { UpdateUserDto } from './user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@UseGuards(AuthorGuard)
export class UserController {

  constructor(private userService: UserService) {}

  @Post('edit/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
      @Body() data: UpdateUserDto,
  ): Promise<Omit<User, 'password' | 'email' | 'recoverCode'>> {
    return this.userService.updateUser(id, data);
  }

}
