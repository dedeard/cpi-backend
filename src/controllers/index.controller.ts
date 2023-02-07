import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import cpi from '@/shared/cpi'
import Joi from 'joi'

export const getIndexes = ca(async (req, res) => {
  const indexes = await db.index.findMany({ include: { consumer: true } })
  const masks = await db.mask.findMany()
  const weight = await db.weight.findMany()

  const data = indexes.map((el) => {
    return {
      ...el,
      cpi: cpi(el, masks, weight)[0] || null,
    }
  })

  res.json(data)
})

export const createIndex = ca(async (req, res) => {
  const masks = await db.consumer.findMany()
  try {
    const { consumerId, age, price, condition } = req.body
    req.body = await Joi.object({
      consumerId: Joi.number()
        .valid(...masks.map((el) => el.id))
        .required(),
      age: Joi.number().min(13).max(100).required(),
      price: Joi.number().min(1000).max(5000000).required(),
      condition: Joi.string().valid('kering', 'kemerahan', 'iritasi', 'kencang dan gatal').required(),
    }).validateAsync({ consumerId, age, price, condition }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create index.', e)
  }
  let index = await db.index.findFirst({ where: { consumerId: req.body.consumerId }, include: { consumer: true } })
  if (index) {
    index = await db.index.update({ where: { id: index.id }, data: req.body, include: { consumer: true } })
  } else {
    index = await db.index.create({ data: req.body, include: { consumer: true } })
  }
  res.json(index)
})

export const updateIndex = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Index id is invalid')
  let index = await db.index.findFirst({ where: { id } })
  if (!index) throw new ApiError(400, 'Index is undefined')
  try {
    const { age, price, condition } = req.body
    req.body = await Joi.object({
      age: Joi.number().min(13).max(100).required(),
      price: Joi.number().min(1000).max(5000000).required(),
      condition: Joi.string().valid('kering', 'kemerahan', 'iritasi', 'kencang dan gatal').required(),
    }).validateAsync({ age, price, condition }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to update index.', e)
  }
  index = await db.index.update({ where: { id }, data: req.body, include: { consumer: true } })
  res.json(index)
})

export const destroyIndex = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Index id is invalid')
  await db.index.delete({ where: { id } })
  res.sendStatus(204)
})
