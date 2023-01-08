import { Router } from 'express'
import { auth } from '@/middlewares/auth.middleware'
import * as accountC from '@/controllers/account.controller'
import * as consumerC from '@/controllers/consumers.controller'
import * as maskC from '@/controllers/masks.controller'
import * as weightC from '@/controllers/weight.controller'
import * as indexC from '@/controllers/index.controller'
import * as cpiC from '@/controllers/cpi.controller'

const route = Router()

route.post('/account/login', accountC.login)
route.get('/account/profile', auth(), accountC.getProfile)

route.get('/consumers', auth({ isAdmin: true }), consumerC.getConsumers)
route.post('/consumers', auth({ isAdmin: true }), consumerC.createConsumer)
route.put('/consumers/:id', auth({ isAdmin: true }), consumerC.updateConsumer)
route.delete('/consumers/:id', auth({ isAdmin: true }), consumerC.destroyConsumer)

route.get('/masks', auth({ isAdmin: true }), maskC.getMasks)
route.post('/masks', auth({ isAdmin: true }), maskC.createMask)
route.put('/masks/:id', auth({ isAdmin: true }), maskC.updateMask)
route.delete('/masks/:id', auth({ isAdmin: true }), maskC.destroyMask)

route.get('/weight', auth({ isAdmin: true }), weightC.getWeight)
route.post('/weight', auth({ isAdmin: true }), weightC.createWeight)
route.put('/weight/:id', auth({ isAdmin: true }), weightC.updateWeight)
route.delete('/weight/:id', auth({ isAdmin: true }), weightC.deleteWeight)

route.get('/indexes', auth({ isAdmin: true }), indexC.getIndexes)
route.post('/indexes', auth({ isAdmin: true }), indexC.createIndex)
route.put('/indexes/:id', auth({ isAdmin: true }), indexC.updateIndex)
route.delete('/indexes/:id', auth({ isAdmin: true }), indexC.destroyIndex)

route.get('/cpi', cpiC.cpi)

export default route
