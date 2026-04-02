import cors from 'cors'
import helmet from 'helmet'
import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

import express, {Application, Request, Response} from 'express'

import {noAsyncHandler} from './middlewares/async-handler.middleware'
import {errorMiddleware} from './middlewares/error.middleware'
import {Routes} from './routes'
import {CONNECT_DB} from './utils/database.config'
import {HttpException} from './utils/http.exception'
import {ENVIRONMENT} from './utils/secrets'

export class App {
  public app: Application

  public constructor() {
    this.app = express()

    void CONNECT_DB()

    this.initializeConfig()
    this.initializeControllers()
    this.initializeErrorHandling()
  }

  private initializeConfig(): void {
    this.app.use(cors({origin: ENVIRONMENT === 'development' ? '*' : '*', credentials: true}))
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(helmet({contentSecurityPolicy: false}))
    this.app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

    if (ENVIRONMENT === 'development') {
      const swaggerDoc = require('./swagger/swagger.json')
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
        customSiteTitle: 'GradeAI API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
      }))
    }
  }

  private initializeControllers(): void {
    this.app.get(
      '/',
      noAsyncHandler((req: Request, res: Response) =>
        res.status(StatusCodes.OK).json({
          success: true,
          msg: 'GradeAI Backend API',
          version: '1.0.0',
        }),
      ),
    )

    this.app.get(
      '/health',
      noAsyncHandler((req: Request, res: Response) =>
        res.status(StatusCodes.OK).json({
          success: true,
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        }),
      ),
    )

    Routes.forEach((controller) => {
      this.app.use('/api' + controller.path, controller.router)
    })

    this.app.use('*', () => {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Endpoint not found!')
    })
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware)
  }
}
