/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { knex } from '../src/database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionSchema.parse(request.body)

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return  {transactions} 
  })

  app.get('/:id',async(request)=>{
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(), 
    })

    const {id} = getTransactionParamSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first() 

    return {transaction}

  })
}
