import { PrismaClient } from '@prisma/client'
import passwordService from './services/password.service'

const prisma = new PrismaClient()

const weight = [
  { target: 'age', value: 0.4, tren: true },
  { target: 'price', value: 0.3, tren: true },
  { target: 'condition', value: 0.2, tren: false },
  { target: 'benefit', value: 0.1, tren: false },
]

const admins = [
  {
    name: 'admin',
    email: 'admin@admin.com',
    password: 'admin',
  },
]

const masks = [
  {
    name: 'freeman hydrating cactus by:',
    age: 5,
    price: 7,
    condition: 7,
    benefit: 4,
  },
  {
    name: 'Rich Moist Soothing Tencel Sheet Mask by: Dear, Klairs.',
    age: 5,
    price: 7,
    condition: 7,
    benefit: 4,
  },
  {
    name: 'Midnight Blue Calming Sheet Mask by: Klairs',
    age: 4,
    price: 6,
    condition: 5,
    benefit: 6,
  },
  {
    name: 'Bird’s Nest Aqua Ampoule Mask by: NSP',
    age: 6,
    price: 6,
    condition: 4,
    benefit: 5,
  },
  {
    name: 'I’m Sheet Mask Tomato by: I’m Real.',
    age: 6,
    price: 4,
    condition: 4,
    benefit: 5,
  },
  {
    name: 'Serum Mask Hydra Bomb Sakura White by: Garnier.',
    age: 6,
    price: 5,
    condition: 7,
    benefit: 4,
  },
  {
    name: 'N.M.F Aquaring Ampoule Mask by: Mediheal N.M.F.',
    age: 7,
    price: 6,
    condition: 4,
    benefit: 5,
  },
  {
    name: 'Sariayu Masker Jerawat by: Martha Tilaar',
    age: 4,
    price: 5,
    condition: 5,
    benefit: 6,
  },
  {
    name: 'Hyaluronic Facial Mask by: Rorec.',
    age: 7,
    price: 4,
    condition: 6,
    benefit: 7,
  },
  {
    name: 'I’m Mask Aloe by: I’m Real.',
    age: 7,
    price: 5,
    condition: 6,
    benefit: 7,
  },
]

async function main() {
  for (let i of admins) {
    await prisma.user.upsert({
      where: { email: i.email },
      update: { ...i, password: await passwordService.hash(i.password), admin: true },
      create: { ...i, password: await passwordService.hash(i.password), admin: true },
    })
  }

  for (let i of weight) {
    await prisma.weight.upsert({
      where: { target: i.target },
      update: i,
      create: i,
    })
  }

  for (let i of masks) {
    const count = await prisma.mask.count({ where: { name: i.name } })
    if (count == 0) await prisma.mask.create({ data: i })
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
