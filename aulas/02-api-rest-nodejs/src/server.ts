import fastify from 'fastify'
import { knex } from './database'
import { title } from 'process'
import crypto from 'node:crypto'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  // const tables = await knex('sqlite_schema').select('*')
  // return tables

  // const transaction = await knex('transactions').insert({
  //   id: crypto.randomUUID(),
  //   title: 'Transação de teste',
  //   amount: 1000,
  // })

  // return transaction

  const transactions = await knex('transactions').select('*')

  return transactions
})

app
  .listen({
    port: env.PORT,
  })
  .then(function () {
    console.log('HTTP  Server Runing!')
  })
