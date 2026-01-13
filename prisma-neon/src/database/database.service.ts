// src/database/database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const retries = 5;
    const delay = 2000;

    for (let i = 0; i < retries; i++) {
      try {
        await this.$connect();
        console.log('Database connected successfully');
        return;
      } catch (error) {
        console.log(`Connection attempt ${i + 1}/${retries} failed`);

        if (i === retries - 1) {
          console.error(' Failed to connect after all retries');
          throw error;
        }

        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
