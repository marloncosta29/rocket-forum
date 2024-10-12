import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation'
import { z } from 'zod'
import { PrismaService } from '@/infra/prisma/db-prisma.service'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchemaProp = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
export class FetchRecentuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchemaProp
  ) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })
    return { questions }
  }
}
