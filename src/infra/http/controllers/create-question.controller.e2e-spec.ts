import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import request from 'supertest'
import { PrismaService } from '@/prisma/db-prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('Create Questions(E2E)', () => {
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

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'jonh doe',
        email: 'jonhdoe@example.com',
        password: '12356',
      },
    })
    const token = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'my title',
        content: 'my content question',
      })

    expect(response.statusCode).toBe(201)

    const questionInDatabase = await prisma.question.findFirst({
      where: {
        userId: user.id,
      },
    })

    expect(questionInDatabase).toBeTruthy()
  })
})
