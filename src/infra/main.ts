import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import type { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService: ConfigService<Env, true> = app.get(ConfigService)
  await app.listen(configService.get('PORT'))
}
bootstrap()
