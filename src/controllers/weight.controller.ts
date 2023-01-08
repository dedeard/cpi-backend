import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import Joi from 'joi'

export const getWeight = ca(async (req, res) => {
  const wight = await db.weight.findMany()
  res.json(wight)
})

export const createWeight = ca(async (req, res) => {
  try {
    const { target, value, tren } = req.body
    req.body = await Joi.object({
      target: Joi.string().min(3).max(30).valid('age', 'price', 'condition', 'benefit').required(),
      value: Joi.number().min(0).max(1).required(),
      tren: Joi.boolean().required(),
    }).validateAsync({ target, value, tren }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create weight.', e)
  }
  const exist = await db.weight.findFirst({ where: { target: req.body.target } })
  if (exist) throw new ApiError(422, 'Target already exists')
  const weight = await db.weight.create({ data: req.body })
  res.json(weight)
})

export const updateWeight = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Weight id is invalid')
  let weight = await db.weight.findFirst({ where: { id } })
  if (!weight) throw new ApiError(400, 'Weight is undefined')
  try {
    const { target, value, tren } = req.body
    req.body = await Joi.object({
      target: Joi.string().min(3).max(30).valid('age', 'price', 'condition', 'benefit').required(),
      value: Joi.number().min(0).max(1).required(),
      tren: Joi.boolean().required(),
    }).validateAsync({ target, value, tren }, { abortEarly: false })
  } catch (e) {
    console.log(e)
    throw new ApiError(422, 'Failed to update weight.', e)
  }
  weight = await db.weight.update({ where: { id }, data: req.body })
  res.json(weight)
})

export const deleteWeight = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Weight id is invalid')
  let weight = await db.weight.findFirst({ where: { id } })
  if (!weight) throw new ApiError(400, 'Weight is undefined')
  await db.weight.delete({ where: { id } })
  res.sendStatus(204)
})
