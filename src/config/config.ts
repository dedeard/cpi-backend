import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const config = {
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',

  port: Number(process.env.PORT || 5000),
  logging: process.env.LOGGING === 'true',

  jwt: {
    secret: String(process.env.JWT_SECRET || 'secret'),
    expDays: Number(process.env.JWT_EXP_DAYS || 30),
  },

  maskMinValue: {
    age: 7,
    price: 4,
    condition: 6,
    benefit: 5,
  },
}

export default config
