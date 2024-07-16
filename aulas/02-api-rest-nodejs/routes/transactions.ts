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

let sessionId = request.cookies.sessionId
  if(!sessionId){
    sessionId = randomUUID()
    reply.cookie('sessionId',sessionId,{
      path:'/',
      maxAge: 60*60*24*7 // 7 dias =>  segundos * horas * qtd horas * dias
    })
    console.log(sessionId)
  }

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

  app.get('/summary',async()=>{
    const summary = await knex ('transactions').sum('amount',{as:'amount'}).first()
     

    return {summary}
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
