import { PrismaClient } from '@prisma/client'
import passwordService from './services/password.service'

const prisma = new PrismaClient()

const weight = [
  { target: 'age', value: 0.4, tren: true },
  { target: 'price', value: 0.3, tren: true },
  { target: 'condition', value: 0.2, tren: false },
  { target: 'benefit', value: 0.1, tren: false },
]

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { name: 'Admin', email: 'admin@admin.com', password: await passwordService.hash('admin'), admin: true },
    create: { name: 'Admin', email: 'admin@admin.com', password: await passwordService.hash('admin'), admin: true },
  })

  for (let i of weight) {
    await prisma.weight.upsert({
      where: { target: i.target },
      update: i,
      create: i,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
