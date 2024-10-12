import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation'
import { z } from 'zod'
import { PrismaService } from '@/infra/prisma/db-prisma.service'

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateUserControllerSchema = z.infer<typeof schema>

@Controller('accounts')
export class CreateUserController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(schema))
  async handle(@Body() body: CreateUserControllerSchema) {
    const { name, email, password } = body

    const userFoundByEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userFoundByEmail) {
      return new ConflictException('User already exists')
    }

    const hashPassword = await hash(password, 8)

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    })
    return { user_id: user.id }
  }
}
