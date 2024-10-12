import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/db-prisma.service'

@Module({
  controllers: [],
  providers: [PrismaService],
})
export class HttpModule {}
