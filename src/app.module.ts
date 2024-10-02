import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/db-prisma.service'
import { CreateUserController } from './controllers/create-user.controller'

@Module({
  providers: [PrismaService],
  controllers: [CreateUserController],
})
export class AppModule {}
