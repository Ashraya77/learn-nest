import { Controller, HttpCode, HttpStatus, Post, NotImplementedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(){
        throw new NotImplementedException("This method is not implemented")
    }
}
