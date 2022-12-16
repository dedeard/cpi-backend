import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import Joi from 'joi'

export const getWeight = ca(async (req, res) => {
  const wight = await db.weight.findMany()
  res.json(wight)
})

export const updateWeight = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Weight id is invalid')
  let weight = await db.weight.findFirst({ where: { id } })
  if (!weight) throw new ApiError(400, 'Weight is undefined')
  try {
    const { target, value, tren } = req.body
    req.body = await Joi.object({
      target: Joi.string().min(3).max(30).required(),
      value: Joi.number().min(0).max(1).required(),
      tren: Joi.boolean().required(),
    }).validateAsync({ target, value, tren }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create weight.', e)
  }
  weight = await db.weight.update({ where: { id }, data: req.body })
  res.json(weight)
})
