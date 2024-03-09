import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.service';
import { EmailLoggerSchema } from './emailLogger.model';
import { EmailLoggerService } from './emailLogger.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: 'EmailLogger', schema: EmailLoggerSchema }]),
  ],
  providers: [EmailService, EmailLoggerService],
  exports: [EmailService],
})
export class EmailModule {}
