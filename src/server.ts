import app from './app'
import { libsql } from './database/database'
import { ErrorMiddleware } from './middlewares/error.middleware'

const PORT = process.env.PORT || 3000

app.use(ErrorMiddleware)

app.listen(PORT, () => {
    console.log(`Series Tracker API running on port: ${PORT}`)
})