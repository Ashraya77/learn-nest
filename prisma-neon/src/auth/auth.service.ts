import { Injectable } from '@nestjs/common';
import { StudentService } from 'src/student/student.service';

type authInput = {
    username: string;
    password: string;
}

type SignInData = {
    stdId: number;
    username: string;
}

@Injectable()
export class AuthService {
    constructor(private studentService: StudentService) { }

     async validateUser(input: authInput): Promise<SignInData | undefined>{
        const user = await this.studentService.findUserbyName(input.username)
        
        if(user && user.password === input.password){
            return{
                stdId: user.stdId,
                username: user.username
            };
        }

     }
}
