import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import request from 'supertest'
import { PrismaService } from '@/prisma/db-prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('Fetch Questions(E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(() => {
    app.close()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'jonh doe',
        email: 'jonhdoe@example.com',
        password: '12356',
      },
    })
    await prisma.question.createMany({
      data: [
        {
          title: 'Question 1',
          slug: 'question-1',
          content: 'Question content',
          userId: user.id,
        },
        {
          title: 'Question 2',
          slug: 'question-2',
          content: 'Question content',
          userId: user.id,
        },
        {
          title: 'Question 3',
          slug: 'question-3',
          content: 'Question content',
          userId: user.id,
        },
        {
          title: 'Question 4',
          slug: 'question-4',
          content: 'Question content',
          userId: user.id,
        },
      ],
    })

    const token = jwt.sign({ sub: user.id })
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toHaveLength(4)
  })
})
