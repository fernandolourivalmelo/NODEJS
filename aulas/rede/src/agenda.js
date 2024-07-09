import cron from 'node-cron'
import { importarConvenios } from '../function/importacaoClubeVantagens.js'
import { assoc} from '../src/dbConfig.js' ;
import { guia} from '../src/dbConfigGuia.js';

importarConvenios()

// cron.schedule('* * * * *',()=>{
//     console.log('=== Executando a função ===')
//     importarConvenios()
// })