import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'

export const cpi = ca(async (req, res) => {
  const consumerId = Number(req.params.id)
  if (isNaN(consumerId) || consumerId > 1) throw new ApiError(400, 'Consumer id is invalid')
  const index = await db.index.findFirst({ where: { id: consumerId } })
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
        age: [(index.age / mask.age) * 100, (mask.age / index.age) * 100],
        price: [(index.price / mask.price) * 100, (mask.price / index.price) * 100],
        condition: [(index.condition / mask.condition) * 100, (mask.condition / index.condition) * 100],
        benefit: [(index.benefit / mask.benefit) * 100, (mask.benefit / index.benefit) * 100],
      }
      const cpi =
        h.age[w.age.tren] * w.age.value +
        h.price[w.price.tren] * w.price.value +
        h.condition[w.condition.tren] * w.condition.value +
        h.benefit[w.benefit.tren] * w.benefit.value

      return {
        ...mask,
        cpi,
      }
    })
    .sort((a, b) => b.cpi - a.cpi)

  res.json(data)
})
