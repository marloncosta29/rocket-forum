import { Module } from '@nestjs/common'
import { CreateUserController } from './http/controllers/create-user.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthenticateController } from './http/controllers/authenticate.controller'
import { CreateQuestionController } from './http/controllers/create-question.controller'
import { FetchRecentuestionsController } from './http/controllers/fetch-recent-questions.controller'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma/db-prisma.service'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  providers: [PrismaService],
  controllers: [
    CreateUserController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentuestionsController,
  ],
})
export class AppModule {}
