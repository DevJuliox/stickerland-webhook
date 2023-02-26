import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'

const app = new App()

app
  .use(logger())
  .get('/', (_, res) => void res.json({ hello: 'world' }))
  .listen(3000)