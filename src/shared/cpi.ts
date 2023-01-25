import { Index, Mask, Weight } from '@prisma/client'

export default function cpi(index: Index, masks: Mask[], weight: Weight[]) {
  return masks
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
        age: [w.age.tren ? mask.age / index.age : index.age / mask.age, (w.age.tren ? mask.age / index.age : index.age / mask.age) * 100],
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
      const cpi = h.age[1] * w.age.value + h.price[1] * w.price.value + h.condition[1] * w.condition.value + h.benefit[1] * w.benefit.value
      return {
        ...mask,
        cpi: Math.trunc(cpi * 100) / 100,
      }
    })
    .sort((a, b) => b.cpi - a.cpi)
}
