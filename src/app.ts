import express, {Response, Request} from 'express'
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'
import seriesRouter from './routes/series.routes'
import genreRouter from './routes/genre.routes'
import quejasRouter from './routes/quejas.routes'


import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser  from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
app.use(cookieParser())

// Configure CORS for your frontend domains
app.use(cors({
    origin: ['http://localhost:5173', 'https://vaultyfrontend.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))

const limiter = rateLimit({
    max: 100,
    windowMs: 1000 * 15 * 60 // 15 minutes
})

app.use(limiter)

// Update API routes to match your TV series application domain
app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/series', seriesRouter)
app.use('/api/genre', genreRouter)
app.use('/api/quejas', quejasRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenido al backend (api rest)')
})

export default app