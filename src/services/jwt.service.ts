import jwt from 'jsonwebtoken'
import moment from 'moment'
import config from '@/config/config'
import { randomUUID } from 'crypto'
import db from '@/config/db'

export interface IJwtPayload {
  uid: number
  jti: string
  exp: number
  iat: number
}

export const generate = (uid: number): { bearer: string; expiredAt: Date } => {
  const iat = moment().unix()
  const exp = moment().add(config.jwt.expDays, 'days')

  const payload: IJwtPayload = {
    uid,
    exp: exp.unix(),
    iat,
    jti: uid + '|' + randomUUID(),
  }
  return {
    bearer: jwt.sign(payload, config.jwt.secret),
    expiredAt: exp.toDate(),
  }
}

export const verify = async (token: string) => {
  const payload: IJwtPayload = jwt.verify(token, config.jwt.secret) as IJwtPayload
  const user = await db.user.findUnique({ where: { id: payload.uid } })
  if (!user) throw new Error('User has deleted')
  return user
}

const jwtService = {
  generate,
  verify,
}

export default jwtService
