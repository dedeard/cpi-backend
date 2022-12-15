import config from '@/config/config'
import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import Joi from 'joi'

export const getMasks = ca(async (req, res) => {
  const masks = await db.mask.findMany()
  res.json(masks)
})

export const createMask = ca(async (req, res) => {
  try {
    const { name, owner, age, price, condition, benefit } = req.body
    req.body = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      owner: Joi.string().min(3).max(30).required(),
      age: Joi.number().min(3).max(9).required(),
      price: Joi.number().min(3).max(9).required(),
      condition: Joi.number().min(3).max(9).required(),
      benefit: Joi.number().min(3).max(9).required(),
    }).validateAsync({ name, owner, age, price, condition, benefit }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create mask.', e)
  }

  const mask = await db.mask.create({ data: req.body })
  res.json(mask)
})

export const updateMask = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Mask id is invalid')
  let mask = await db.mask.findFirst({ where: { id } })
  if (!mask) throw new ApiError(400, 'Mask is undefined')
  try {
    const { name, owner, age, price, condition, benefit } = req.body
    req.body = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      owner: Joi.string().min(3).max(30).required(),
      age: Joi.number().min(config.maskMinValue.age).required(),
      price: Joi.number().min(config.maskMinValue.price).required(),
      condition: Joi.number().min(config.maskMinValue.condition).required(),
      benefit: Joi.number().min(config.maskMinValue.benefit).required(),
    }).validateAsync({ name, owner, age, price, condition, benefit }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create mask.', e)
  }

  mask = await db.mask.update({ where: { id }, data: req.body })
  res.json(mask)
})

export const destroyMask = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Mask id is invalid')
  await db.mask.delete({ where: { id } })
  res.sendStatus(204)
})
