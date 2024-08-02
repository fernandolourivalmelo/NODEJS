import cron from 'node-cron'
import { importarConvenios, importarOdontologia } from '../function/importacaoClubeVantagens.js'
import { assoc} from '../src/dbConfig.js' ;
import { guia} from '../src/dbConfigGuia.js';



importarOdontologia()

importarConvenios()

// const task = cron.schedule('* * * * *',()=>{   
//     console.log('=== Executando a função ===')
//     importarOdontologia()
// })

// task.start
// setTimeout(()=>{
//     task.stop
// }, 5 * 60 * 1000)
