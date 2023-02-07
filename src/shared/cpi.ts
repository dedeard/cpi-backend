import { Index, Mask, Weight } from '@prisma/client'

const getAge = (age: number) => {
  if (age < 13) return 0
  else if (age <= 19) return 1
  else return 2
}

const getPrice = (price: number) => {
  if (price >= 35000) return 1
  else if (price >= 25000) return 2
  else if (price >= 15000) return 3
  else return 4
}

const getCondition = (condition: string) => {
  switch (condition) {
    case 'iritasi':
      return 1
    case 'kemerahan':
      return 2
    case 'kering':
      return 3
    case 'kencang dan gatal':
      return 4
    default:
      return 0
  }
}

const convertMask = (mask: Mask) => {
  return {
    age: getAge(mask.age),
    price: getPrice(Number(mask.price)),
    condition: getCondition(mask.condition),
  }
}

const convertIndex = (index: Index) => {
  return {
    age: getAge(index.age),
    price: getPrice(Number(index.price)),
    condition: getCondition(index.condition),
  }
}

export default function cpi(iindex: Index, masks: Mask[], weight: Weight[]) {
  return masks
    .map((data) => {
      const mask = convertMask(data)
      const index = convertIndex(iindex)

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
      }
      const cpi = h.age[1] * w.age.value + h.price[1] * w.price.value + h.condition[1] * w.condition.value
      return {
        ...data,
        value: mask,
        cpi: Math.trunc(cpi * 100) / 100,
      }
    })
    .sort((a, b) => b.cpi - a.cpi)
}
