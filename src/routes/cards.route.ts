import { Router } from 'express'
import cardControllers from '~/controllers/cards.controller'
import authMiddlewares from '~/middlewares/auth.middleware'
import cardMiddlewares from '~/middlewares/cards.middleware'
import { wrapRequestHanlers } from '~/utils/handles'

const cardsRoutes = Router()

// route for create card
cardsRoutes.post(
  '/create-card',
  authMiddlewares.accessTokenValidator,
  cardMiddlewares.createCardValidator,
  wrapRequestHanlers(cardControllers.createCard)
)
cardsRoutes.get('/get-cards', authMiddlewares.accessTokenValidator, wrapRequestHanlers(cardControllers.getCards))

// route for delete card
cardsRoutes.delete(
  '/delete-card-by-id/:id',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(cardControllers.deleteCardById)
)
// route for update card status default
cardsRoutes.put(
  '/update-card-status-default',
  authMiddlewares.accessTokenValidator,
  wrapRequestHanlers(cardControllers.updateCardStatusDefault)
)
// route for update card
cardsRoutes.put(
  '/update-card/:id',
  authMiddlewares.accessTokenValidator,
  cardMiddlewares.createCardValidator,
  wrapRequestHanlers(cardControllers.updateCard)
)
export default cardsRoutes
