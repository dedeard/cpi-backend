import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'

export const cpi = ca(async (req, res) => {
  const consumerId = Number(req.query.id)
  if (isNaN(consumerId) || consumerId < 1) throw new ApiError(400, 'Consumer id is invalid')
  const consumer = await db.consumer.findFirst({ where: { id: consumerId } })
  if (!consumer) throw new ApiError(400, 'Consumer not found')
  const index = await db.index.findFirst({ where: { consumerId } })
  if (!index) throw new ApiError(400, 'Consumer id is invalid')
  const masks = await db.mask.findMany()
  const weight = await db.weight.findMany()

  const data = masks
    .map((mask) => {
      const w = {
        age: {
          value: Number(weight.find((el) => el.target === 'age')?.value || 0),
          tren: weight.find((el) => el.target === 'age')?.tren ? 1 : 0,
        },
        price: {
          value: Number(weight.find((el) => el.target === 'price')?.value || 0),
          tren: weight.find((el) => el.target === 'price')?.tren ? 1 : 0,
        },
        condition: {
          value: Number(weight.find((el) => el.target === 'condition')?.value || 0),
          tren: weight.find((el) => el.target === 'condition')?.tren ? 1 : 0,
        },
        benefit: {
          value: Number(weight.find((el) => el.target === 'benefit')?.value || 0),
          tren: weight.find((el) => el.target === 'benefit')?.tren ? 1 : 0,
        },
      }
      const h = {
        age: [
          w.age.tren ? mask.age / index.age : index.age / mask.age,
          (w.age.tren ? mask.age / index.age : index.age / mask.age) * 100,
        ],
        price: [
          w.price.tren ? mask.price / index.price : index.price / mask.price,
          (w.price.tren ? mask.price / index.price : index.price / mask.price) * 100,
        ],
        condition: [
          w.condition.tren ? mask.condition / index.condition : index.condition / mask.condition,
          (w.condition.tren ? mask.condition / index.condition : index.condition / mask.condition) * 100,
        ],
        benefit: [
          w.benefit.tren ? mask.benefit / index.benefit : index.benefit / mask.benefit,
          (w.benefit.tren ? mask.benefit / index.benefit : index.benefit / mask.benefit) * 100,
        ],
      }
      const cpi =
        h.age[1] * w.age.value +
        h.price[1] * w.price.value +
        h.condition[1] * w.condition.value +
        h.benefit[1] * w.benefit.value
      return {
        ...mask,
        cpi: Math.trunc(cpi * 100) / 100,
      }
    })
    .sort((a, b) => b.cpi - a.cpi)

  res.json({ cpi: data, consumer })
})
