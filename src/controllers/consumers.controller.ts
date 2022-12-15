import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import Joi from 'joi'

export const getConsumers = ca(async (req, res) => {
  const consumers = await db.consumer.findMany()
  res.json(consumers)
})

export const createConsumer = ca(async (req, res) => {
  try {
    const { name, email, phone } = req.body
    req.body = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(3).max(30).required(),
    }).validateAsync({ name, email, phone }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create album.', e)
  }

  const consumer = await db.consumer.create({ data: req.body })
  res.json(consumer)
})

export const updateConsumer = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Consumer id is invalid')
  let consumer = await db.consumer.findFirst({ where: { id } })
  if (!consumer) throw new ApiError(404, 'Consumer not found')

  try {
    const { name, email, phone } = req.body
    req.body = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(3).max(30).required(),
    }).validateAsync({ name, email, phone }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create consumer.', e)
  }

  consumer = await db.consumer.update({ where: { id }, data: req.body })
  res.json(consumer)
})

export const destroyConsumer = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Consumer id is invalid')
  await db.consumer.delete({ where: { id } })
  res.sendStatus(204)
})
