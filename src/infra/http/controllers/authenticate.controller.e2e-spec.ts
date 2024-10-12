import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import request from 'supertest'
import { PrismaService } from '@/prisma/db-prisma.service'
import { hash } from 'bcryptjs'
import { string } from 'zod'

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

  test('[POST] /sessions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'jonh doe',
        email: 'jonhdoe@example.com',
        password: await hash('12356', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jonhdoe@example.com',
      password: '12356',
    })
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ access_token: expect.any(String) })
  })
})
