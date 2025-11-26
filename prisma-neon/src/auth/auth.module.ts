import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [StudentModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
