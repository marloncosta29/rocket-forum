import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation'
import { generateSlug } from '@/infra/utils/create-slug'
import { z } from 'zod'
import { PrismaService } from '@/infra/prisma/db-prisma.service'
import { TokenSchemaProps } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchemaProps = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async handle(
    @CurrentUser() user: TokenSchemaProps,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchemaProps
  ) {
    const userId = user.sub
    const { title, content } = body
    const question = await this.prisma.question.create({
      data: {
        userId,
        title,
        content,
        slug: generateSlug(title),
      },
    })
    return { question_id: question.id }
  }
}
