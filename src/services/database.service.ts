import { Collection, Db, MongoClient } from 'mongodb'
import envConfig from '~/constants/config'
import Admin from '~/models/schemas/Admin.schema'
import { Card } from '~/models/schemas/Card.schema'
import Customer from '~/models/schemas/Customer.schema'
import { Food } from '~/models/schemas/Food.schema'
import { Category } from '~/models/schemas/Category.schema'
import { Menu } from '~/models/schemas/Menu.schema'
import { MenuSection } from '~/models/schemas/MenuSection.schema'
import Partner from '~/models/schemas/Partner.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { Restaurant } from '~/models/schemas/Restaurant.schema'
import { FoodType } from '~/models/schemas/FoodType.schema'
import { User } from '~/models/schemas/User.schema'
import { Shop } from '~/models/schemas/Shop.schemas'
import { FoodCategories } from '~/models/schemas/FoodCategories.schema'
import { FoodOptions } from '~/models/schemas/FoodOptions.schema'
import { Option } from '~/models/schemas/Option.schema'

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(envConfig.DB_URI)
    this.db = this.client.db(envConfig.DB_NAME)
  }
  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('Connected successfully to database')
    } catch (err) {
      console.log(err)
    } finally {
      // await this.client.close()
    }
  }
  get users(): Collection<User> {
    return this.db.collection(envConfig.DB_COLLECTION_USERS)
  }
  get customers(): Collection<Customer> {
    return this.db.collection(envConfig.DB_COLLECTION_CUSTOMERS)
  }
  get refresh_tokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.DB_COLLECTION_REFRESH_TOKENS)
  }
  get admins(): Collection<Admin> {
    return this.db.collection(envConfig.DB_COLLECTION_ADMINS)
  }
  get partners(): Collection<Partner> {
    return this.db.collection(envConfig.DB_COLLECTION_PARTNERS)
  }
  get shops(): Collection<Shop> {
    return this.db.collection(envConfig.DB_COLLECTION_SHOPS)
  }
  get restaurants(): Collection<Restaurant> {
    return this.db.collection(envConfig.DB_COLLECTION_RESTAURANTS)
  }
  get cards(): Collection<Card> {
    return this.db.collection(envConfig.DB_COLLECTION_CARDS)
  }
  get menus(): Collection<Menu> {
    return this.db.collection(envConfig.DB_COLLECTION_MENUS)
  }
  get menu_sections(): Collection<MenuSection> {
    return this.db.collection(envConfig.DB_COLLECTION_MENU_SECTIONS)
  }
  get food_types(): Collection<FoodType> {
    return this.db.collection(envConfig.DB_COLLECTION_FOOD_TYPES)
  }
  get food(): Collection<Food> {
    return this.db.collection(envConfig.DB_COLLECTION_FOOD)
  }
  get categories(): Collection<Category> {
    return this.db.collection(envConfig.DB_COLLECTION_CATEGORIES)
  }
  get food_categories(): Collection<FoodCategories> {
    return this.db.collection(envConfig.DB_COLLECTION_FOOD_CATEGORIES)

  }
  get food_options(): Collection<FoodOptions> {
    return this.db.collection(envConfig.DB_COLLECTION_FOOD_OPTIONS)
  }
  get options(): Collection<Option> {
    return this.db.collection(envConfig.DB_COLLECTION_OPTIONS)
  }
}
const databaseSetvices = new DatabaseServices()
export default databaseSetvices
