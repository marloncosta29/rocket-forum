import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import request from 'supertest'
import { PrismaService } from '@/prisma/db-prisma.service'

describe('Create Account(E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  afterAll(() => {
    app.close()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'jonh doe',
      email: 'jonhdoe@example.com',
      password: '12356',
    })

    expect(response.statusCode).toBe(201)

    const userInDataBase = await prisma.user.findUnique({
      where: { email: 'jonhdoe@example.com' },
    })

    expect(userInDataBase).toBeTruthy()
  })
})
