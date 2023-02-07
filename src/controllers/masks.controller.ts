import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import { onlyImageLookup } from '@/shared/validationLookup'
import { UploadedFile } from 'express-fileupload'
import Joi from 'joi'
import path from 'path'

export const getMasks = ca(async (req, res) => {
  const masks = await db.mask.findMany()
  res.json(masks)
})

export const createMask = ca(async (req, res) => {
  try {
    const image = req.files?.image
    const { name, age, price, condition } = req.body
    req.body = await Joi.object({
      name: Joi.string().min(3).max(250).required(),
      age: Joi.number().min(13).max(100).required(),
      price: Joi.number().min(1000).max(5000000).required(),
      condition: Joi.string().valid('kering', 'kemerahan', 'iritasi', 'kencang dan gatal').required(),
      image: Joi.any().required().external(onlyImageLookup()),
    }).validateAsync({ name, age, price, condition, image }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create mask.', e)
  }

  const image: UploadedFile = req.body.image
  await image.mv(path.join(__dirname, '../../uploads', image.name))
  req.body.image = image.name
  const mask = await db.mask.create({ data: req.body })
  res.json(mask)
})

export const updateMask = ca(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1) throw new ApiError(400, 'Mask id is invalid')
  let mask = await db.mask.findFirst({ where: { id } })
  if (!mask) throw new ApiError(400, 'Mask is undefined')
  try {
    const image = req.files?.image
    const { name, age, price, condition } = req.body
    req.body = await Joi.object({
      name: Joi.string().min(3).max(250).required(),
      age: Joi.number().min(13).max(100).required(),
      price: Joi.number().min(1000).max(5000000).required(),
      condition: Joi.string().valid('kering', 'kemerahan', 'iritasi', 'kencang dan gatal').required(),
      image: Joi.any().external(onlyImageLookup()),
    }).validateAsync({ name, age, price, condition, image }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed to create mask.', e)
  }

  if (req.body.image) {
    const image: UploadedFile = req.body.image
    await image.mv(path.join(__dirname, '../../uploads', image.name))
    req.body.image = image.name
  } else {
    req.body.image = undefined
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
