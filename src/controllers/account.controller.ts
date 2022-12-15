import Joi from 'joi'
import ca from '@/shared/catchAsync'
import ApiError from '@/shared/ApiError'
import db from '@/config/db'
import passwordService from '@/services/password.service'
import jwtService from '@/services/jwt.service'

/**
 * Login
 * POST /auth/login
 *
 */
export const login = ca(async (req, res) => {
  try {
    const { email, password } = req.body
    req.body = await Joi.object({
      password: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
    }).validateAsync({ email, password }, { abortEarly: false })
  } catch (e) {
    throw new ApiError(422, 'Failed login.', e)
  }

  const user = await db.user.findFirst({ where: { email: req.body.email } })
  if (user && (await passwordService.verify(req.body.password, user.password))) {
    return res.json(jwtService.generate(user.id))
  }
  throw new ApiError(400, 'Password and email combination is invalid.')
})

/**
 * Get profile
 * GET /account/profile
 *
 */
export const getProfile = ca((req, res) => {
  res.json({ ...req.user, password: undefined })
})
