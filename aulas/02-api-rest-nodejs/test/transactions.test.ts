import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    execSync('npm rum knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be abe to create a new transaction', async () => {
    // chamada HTTP p/ criar nova transação
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    console.log('Cabeçalho=>' + JSON.stringify(response.headers))
  })

  it('shoud be able list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction Teste',
        amount: 1978,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Transaction Teste',
        amount: 1978,
      }),
    ])
    // console.log('Listagem=>' + JSON.stringify(listTransactionResponse))
  })

  it('shoud be able to get a speciffic transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction Teste',
        amount: 1978,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id
    console.log(`Transaction retorno =>` + transactionId)
    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)
    console.log(
      `getTransactionResponse =>` + getTransactionResponse.body.transaction,
    )
    // expect(getTransactionResponse.body.Transaction).toEqual(
    //   expect.objectContaining({
    //     title: 'Transaction Teste',
    //     amount: 1978,
    //   }),
    // )
  })

  it('shoud be able to get de summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
    // console.log('Listagem=>' + JSON.stringify(listTransactionResponse))
  })
})
