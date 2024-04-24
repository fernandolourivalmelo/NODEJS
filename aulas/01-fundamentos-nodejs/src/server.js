
import http from 'node:http'

const server = http.createServer((req,res)=>{
    return res.end('Deu certo 1234')

})

server.listen(3333)
