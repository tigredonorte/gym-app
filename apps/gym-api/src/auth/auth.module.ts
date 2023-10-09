import { Module } from '@nestjs/common';
import { AuthController } from './controller.module';

@Module({
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
