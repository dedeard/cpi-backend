import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

export const hash = async (password: string): Promise<string> => {
  const salt = randomBytes(8).toString('hex')
  const derivedKey = await promisify<string, string, number, Buffer>(scrypt)(password, salt, 64)
  return salt + ':' + derivedKey.toString('hex')
}

export const verify = async (password: string, hash: string): Promise<Boolean> => {
  const [salt, key] = hash.split(':')
  const derivedKey = await promisify<string, string, number, Buffer>(scrypt)(password, salt, 64)
  return key === derivedKey.toString('hex')
}

const passwordService = {
  hash,
  verify,
}

export default passwordService
