import db from '@/config/db'
import ApiError from '@/shared/ApiError'
import ca from '@/shared/catchAsync'
import makeCpi from '@/shared/cpi'

export const cpi = ca(async (req, res) => {
  const consumerId = Number(req.query.id)
  if (isNaN(consumerId) || consumerId < 1) throw new ApiError(400, 'Consumer id is invalid')
  const consumer = await db.consumer.findFirst({ where: { id: consumerId } })
  if (!consumer) throw new ApiError(400, 'Consumer not found')
  const index = await db.index.findFirst({ where: { consumerId } })
  if (!index) throw new ApiError(400, 'Consumer id is invalid')
  const masks = await db.mask.findMany()
  const weight = await db.weight.findMany()

  res.json({ cpi: makeCpi(index, masks, weight), consumer })
})
