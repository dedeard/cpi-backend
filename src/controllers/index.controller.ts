import config from '@/config/config'
import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import Joi from 'joi'

export const getIndexes = ca(async (req, res) => {
  const indexes = await db.index.findMany()
  res.json(indexes)
})

export const createIndex = ca(async (req, res) => {
  const masks = await db.consumer.findMany()
  try {
    const { consumerId, age, price, condition, benefit } = req.body
    req.body = Joi.object({
      consumerId: Joi.number()
        .valid(...masks.map((el) => el.id))
        .required(),
      age: Joi.number().min(config.maskMinValue.age).required(),
      price: Joi.number().min(config.maskMinValue.price).required(),
      condition: Joi.number().min(config.maskMinValue.condition).required(),
      benefit: Joi.number().min(config.maskMinValue.benefit).required(),
    }).validateAsync({ consumerId, age, price, condition, benefit }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create index.', e)
  }
  let index = await db.index.findFirst({ where: { consumerId: req.body.consumerId } })
  if (index) {
    index = await db.index.update({ where: { id: index.id }, data: req.body })
  } else {
    index = await db.index.create({ data: req.body })
  }
  res.json(index)
})

export const updateIndex = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Index id is invalid')
  let index = await db.index.findFirst({ where: { id } })
  if (!index) throw new ApiError(400, 'Index is undefined')
  try {
    const { age, price, condition, benefit } = req.body
    req.body = Joi.object({
      age: Joi.number().min(config.maskMinValue.age).required(),
      price: Joi.number().min(config.maskMinValue.price).required(),
      condition: Joi.number().min(config.maskMinValue.condition).required(),
      benefit: Joi.number().min(config.maskMinValue.benefit).required(),
    }).validateAsync({ age, price, condition, benefit }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to update index.', e)
  }
  index = await db.index.update({ where: { id }, data: req.body })
  res.json(index)
})

export const destroyIndex = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Index id is invalid')
  await db.index.delete({ where: { id } })
  res.sendStatus(204)
})
