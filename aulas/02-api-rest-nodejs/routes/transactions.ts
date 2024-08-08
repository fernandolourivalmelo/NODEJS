/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { knex } from '../src/database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'


export async function transactionsRoutes(app: FastifyInstance) {

  app.addHook('preHandler',async(request,reply)=>{
    console.log(`[${request.method}]-[${request.url}]`)
  })

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
      session_id: sessionId,
    })

    return reply.status(201).send()
  })


  app.get('/',
    {preHandler:[checkSessionIdExists]}, 
    async (request,reply) => {

    const sessionId = request.cookies.sessionId

    const transactions = await knex('transactions').where('session_id',sessionId).select()

    return  {transactions} 
  })

  app.get('/summary',
    {
      preHandler:[checkSessionIdExists]
    },
    async(request)=>{
      const {sessionId} = request.cookies
      const summary = await knex ('transactions')
     .where('session_id', sessionId)
     .sum('amount',{as:'amount'})
      .first()
     

    return {summary}
  })

  app.get('/:id',async(request)=>{
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(), 
    })

    const {id} = getTransactionParamSchema.parse(request.params)
   
    const transaction = await knex('transactions').where('id',id).first() 

    return {transaction}

  })

  app.get('/tabelas',async()=>{
    const tables = await knex('sqlite_schema').select('*')
  
    return {tables}
  })
  
}
