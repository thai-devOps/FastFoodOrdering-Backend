import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import databaseSetvices from '~/services/database.service'
import envConfig from '~/constants/config'
import customerRoutes from './routes/customers.route'
import { defaultErrorHandler } from './utils/errors'
import authRoute from './routes/admins.route'
import partnerRoutes from './routes/partner.route'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { responseSuccess } from './utils/response'
import restaurantRoutes from './routes/restaurants.route'
import authMiddlewares from './middlewares/auth.middleware'
import cardsRoutes from './routes/cards.route'
import fs from 'fs'
import menuRouter from './routes/menu.route'
import foodRouters from './routes/food.route'
import menuSectionRoutes from './routes/menu_sections.route'
import categoryRouters from './routes/categories.route'
import foodTypeRouters from './routes/food_types.route'
import shopRoutes from './routes/shops.route'
import foodOptionsRouters from './routes/food_options.route'
cloudinary.config({
  cloud_name: envConfig.cloud_name,
  api_key: envConfig.api_key,
  api_secret: envConfig.api_secret
})
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  },
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  }
})
const upload = multer({ storage: storage })
const app = express()
app.use(
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003']
  })
)
app.use(morgan('dev'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// connect to database
databaseSetvices.connect()
app.use((req: Request, res: Response, next: NextFunction) => {
  setTimeout(() => {
    next()
  }, 500)
})
// routes
// Route for file upload
app.post(
  '/api/v1/partners/upload-avatar',
  authMiddlewares.accessTokenValidator,
  upload.single('avatar'),
  async (req: Request, res: Response) => {
    try {
      // Upload the file to Cloudinary
      // const image = req.file?.buffer as unknown as string
      const result = await cloudinary.uploader.upload(req.file?.path as string, {
        folder: 'images' // Optional: Set the folder in Cloudinary
      })

      // Return the Cloudinary URL or any other response as needed
      responseSuccess(res, {
        message: 'Upload image successfully',
        data: {
          url: result.secure_url,
          public_id: result.public_id
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)
// Route for update file upload
app.post(
  '/api/v1/partners/update-avatar',
  upload.single('avatar'),
  authMiddlewares.accessTokenValidator,
  async (req: Request, res: Response) => {
    try {
      // Upload the file to Cloudinary
      // const image = req.file?.buffer as unknown as string
      const result = await cloudinary.uploader.upload(req.file?.path as string, {
        folder: 'images' // Optional: Set the folder in Cloudinary
      })
      // Delete file in local
      fs.unlinkSync(req.file?.path as string)
      // Destroy old image in Cloudinary
      const public_id = req.body.publicId
      if (public_id) {
        await cloudinary.uploader.destroy(public_id)
      }
      // Return the Cloudinary URL or any other response as needed
      responseSuccess(res, {
        message: 'Upload image successfully',
        data: {
          url: result.secure_url,
          public_id: result.public_id
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

app.use('/api/v1/customers', customerRoutes)
app.use('/api/v1/admins', authRoute)
app.use(
  '/api/v1/partners',
  partnerRoutes,
  shopRoutes,
  restaurantRoutes,
  cardsRoutes,
  menuRouter,
  menuSectionRoutes,
  categoryRouters,
  foodTypeRouters,
  foodRouters,
  foodOptionsRouters
)

// error handler
app.use(defaultErrorHandler)
app.listen(envConfig.PORT, () => {
  console.log(`Server starting on PORT: ${envConfig.PORT}`)
})
