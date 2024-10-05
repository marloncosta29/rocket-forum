import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation'
import { PrismaService } from 'src/prisma/db-prisma.service'
import { z } from 'zod'

const authBoodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthBoodySchemaBody = z.infer<typeof authBoodySchema>

@Controller('sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authBoodySchema))
  async handle(@Body() body: AuthBoodySchemaBody) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })
    if (!user) {
      return new UnauthorizedException('Invalid user credentials')
    }
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return new UnauthorizedException('Invalid user credentials')
    }
    const accessToken = this.jwt.sign({ sub: user.id })
    return {
      access_token: accessToken,
    }
  }
}
