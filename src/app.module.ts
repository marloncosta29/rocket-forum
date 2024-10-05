import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/db-prisma.service'
import { CreateUserController } from './controllers/create-user.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentuestionsController } from './controllers/fetch-recent-questions.controller'

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
