import fastify from 'fastify'
import { knex } from './database'
import { title } from 'process'
import crypto from 'node:crypto'
import { env } from './env'
import { transactionsRoutes } from '../routes/transactions'

const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(function () {
    console.log('HTTP  Server Runing!')
  })
