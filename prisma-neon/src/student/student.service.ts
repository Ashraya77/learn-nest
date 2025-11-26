import { Injectable } from '@nestjs/common';

export type Student = {
    stdId: number;
    username: string;
    password: string;
}

const students: Student[] = [
    {
        stdId: 1,
        username: "john",
        password: "pokhara"
    },
     {
        stdId: 2,
        username: "snow",
        password: "pokhara"
    }

]

@Injectable()
export class StudentService {
    async findUserbyName(username: string,): Promise<Student | undefined> {
        return students.find((student)=> student.username === username)
    }
 }
