import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { TokenSchemaProps } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation'
import { PrismaService } from 'src/prisma/db-prisma.service'
import { generateSlug } from 'src/utils/create-slug'
import { z } from 'zod'

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
