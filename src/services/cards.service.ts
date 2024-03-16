import { CardRequestBody } from '~/models/requests/Card.request'
import databaseSetvices from './database.service'
import { Card } from '~/models/schemas/Card.schema'
import { ObjectId } from 'mongodb'

class CardServices {
  public async create(user_id: string, card: CardRequestBody) {
    // Check if the card is active
    const isActive = card.is_active === true

    // If the card is active, update all cards of the user to inactive
    if (isActive) {
      await databaseSetvices.cards.updateMany({ account_id: new ObjectId(user_id) }, { $set: { is_active: false } })
    }

    // Create the new card entry
    const newCard = new Card({
      ...card,
      account_id: new ObjectId(user_id),
      is_active: isActive,
      created_at: new Date(),
      updated_at: new Date()
    })

    // Insert the new card entry into the database
    return await databaseSetvices.cards.insertOne(newCard)
  }

  public async getAll(user_id: string) {
    return await databaseSetvices.cards.find({ account_id: new ObjectId(user_id) }).toArray()
  }
  public async deleteById(id: string) {
    return await databaseSetvices.cards.deleteOne({ _id: new ObjectId(id) })
  }
  public async updateStatusDefault(user_id: string, payload: { id: string; active: boolean }) {
    const { id, active } = payload

    // Check if the card is active
    const isActive = active === true

    // If the card is active, update all cards of the user to inactive except the one specified
    if (isActive) {
      await databaseSetvices.cards.updateMany(
        { account_id: new ObjectId(user_id), _id: { $ne: new ObjectId(id) } },
        { $set: { is_active: false } }
      )
    }

    // Update the status of the specified card
    await databaseSetvices.cards.updateOne(
      { _id: new ObjectId(id), account_id: new ObjectId(user_id) },
      { $set: { is_active: isActive } }
    )
  }
  public async update(user_id: string, id: string, payload: CardRequestBody) {
    // Check if the card is active
    const isActive = payload.is_active === true
    // If the card is active, update all cards of the user to inactive except the one specified
    if (isActive) {
      await databaseSetvices.cards.updateMany(
        { account_id: new ObjectId(user_id), _id: { $ne: new ObjectId(id) } },
        { $set: { is_active: false } }
      )
    }
    // Update the specified card
    return await databaseSetvices.cards.updateOne(
      { _id: new ObjectId(id), account_id: new ObjectId(user_id) },
      { $set: { ...payload, _id: new ObjectId(id), is_active: isActive, updated_at: new Date() } }
    )
  }
}
const cardServices = new CardServices()
export default cardServices
