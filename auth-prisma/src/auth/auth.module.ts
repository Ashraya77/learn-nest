import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.registerAsync({
      //used configmodule to fix login api, The issue here is that process.env.JWT_SECRET is being evaluated when the module is initialized, but at that point the environment variables might not be loaded yet. You need to use JwtModule.registerAsync() with ConfigService instead.

      //If you don't want to configure the module, pass the secret explicitly: inside accessToken in authService
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}