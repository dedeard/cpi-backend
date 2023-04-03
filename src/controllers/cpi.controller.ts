import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import makeCpi, { getAge, getCondition, getPrice } from '@/shared/cpi'

export const cpi = ca(async (req, res) => {
  const consumerId = Number(req.query.id)
  if (isNaN(consumerId) || consumerId < 1) throw new ApiError(400, 'Consumer id is invalid')
  const consumer = await db.consumer.findFirst({ where: { id: consumerId } })
  if (!consumer) throw new ApiError(400, 'Consumer not found')
  const index = await db.index.findFirst({ where: { consumerId } })
  if (!index) throw new ApiError(400, 'Consumer id is invalid')

  const age = getAge(index.age)
  const condition = getCondition(index.condition)
  const price = getPrice(Number(index.price))

  let where: any = {
    AND: [
      {
        age: { gte: 13 },
      },
      {
        age: { lte: 19 },
      },
      {
        condition: index.condition,
      },
    ],
  }
  if (age == 2) {
    where = {
      age: { gt: 19 },
      condition: index.condition,
    }
  }
  let masks = await db.mask.findMany({ where })

  masks = masks.filter((el) => {
    const lp = getPrice(Number(el.price))
    return lp === price
  })

  const weight = await db.weight.findMany()

  res.json({ cpi: makeCpi(index, masks, weight), consumer })
})
