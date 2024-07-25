import Fastify from 'fastify';
import FormData from 'form-data';
import fetch from 'node-fetch'
import fs from 'fs';
import { assoc} from './dbConfig.js';
import { guia} from './dbConfigGuia.js';
import { CharToNumber,NumberToChar } from '../function/numberToChar.js';
import { importarConvenios, importarOdontologia } from '../function/importacaoClubeVantagens.js'

const fastify = Fastify();//{logger:true}

 // and id_gds = 2

 

 fastify.get('/teste', async (req,reply)=>{


      // //const queryUpdate = `SELECT TOP (50) Cd_convênio, Razão_social FROM A_convenio`
      // //const queryUpdate = `SELECT TOP (50) [id_grupo_area], [fk_grupo], [fk_cd_da_area] FROM [grupo_area]`
      // const queryUpdate = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
      // let result1 = (await assoc.request().query(queryUpdate)).recordset;
      // result1.forEach( banco =>{
      //     console.log(banco.TABLE_NAME);
      //     } 
      // )

      // console.log(' ============= CONEXÃO BANCO GUIA ONLINE ============= ')
      // let result = (await pool2.query(queryUpdate)).recordset;
      // result.forEach( banco =>{
      //     console.log(banco.TABLE_NAME);
      //     } 
      // )

 const matricula= 'hhzz'
const texto= 'hhzz'

  
 console.log('NumberToChar ==>' + await NumberToChar(matricula))
 console.log('CharToNumber ==>' + await CharToNumber(texto))
 
  reply.status('200').send('Teste')


 })

fastify.get('/importarConvenios', async (request, reply) => {
  try {

    importarConvenios()

    reply.status('200').send({resultado})

} catch (err) {
    reply.status(500).send({ error: 'Internal Server Error 112' + err });
  }
});

fastify.get('/importarOdontologia', async (request, reply) => {
  try {

    importarOdontologia()

    reply.status('200').send({resultado})

} catch (err) {
    reply.status(500).send({ error: 'Internal Server Error 112' + err });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3333 });
    //fastify.log.info('Server listening on http://localhost:3333');
    
  } catch (err) {
    //fastify.log.error(err);
    process.exit(1);
  }
};

start().then(()=>{
  console.log('Servidor rodando')
});
