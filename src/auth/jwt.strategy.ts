import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/env'
import { z } from 'zod'

const tokenSchema = z.object({
  sub: z.string().uuid(),
})

export type TokenSchemaProps = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', {})
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKey: Buffer.from(publicKey, 'base64'),
    })
  }

  async validate(payload: TokenSchemaProps) {
    return tokenSchema.parse(payload)
  }
}
