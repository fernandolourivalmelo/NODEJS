
import http from 'node:http'
import { json } from './middlewares/json.js'
import { dataBase} from './database.js'


const database = new dataBase()

const server = http.createServer(async (req,res)=>{
const{method,url}  = req

await json(req,res)

if(method=='GET' && url == '/users'){
    const users = database.select('users')
    // console.log('method get')
    // console.log(JSON.stringify(users))
    return res.end(JSON.stringify(users))
}


if(method=='POST' && url == '/users'){
    const {name,email} = req.body

    const user = {
        id: 2,
        name,
        email ,
    }
    
    database.insert('users',user)

    return res.writeHead(201).end()
}


})

server.listen(3333)
