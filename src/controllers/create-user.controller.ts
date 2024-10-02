import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation'
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma/db-prisma.service'
import { z } from 'zod'

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

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    })
  }
}
