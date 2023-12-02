import { Injectable } from '@nestjs/common';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { SignupDto } from './auth.dto';

@Injectable()
export class AuthService {

  constructor(private userService: UserService) {}

  async signup(signupDto: SignupDto): Promise<User> {
    return this.userService.create(signupDto);
  }
}