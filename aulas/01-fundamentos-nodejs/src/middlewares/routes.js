
import { randomUUID } from 'node:crypto'
import {dataBase} from '../dataBase.js'
import { buildRoutePath } from '../utils/buildRoutePath.js'

const database = new dataBase()

export const routes=[
{
    method:'GET',
    path:buildRoutePath('/users'),
    handler:(req,res) =>{
        const users = database.select('users')
        return res.end(JSON.stringify(users))
    }

}, 
{
    method:'POST',
    path:buildRoutePath('/users'),
    handler:(req,res)=>{
        const {name,email} = req.body
        const user = {
            id: randomUUID(),
            name: name + (Date.now()), 
            email ,
       }
         database.insert('users',user)
 
         return res.writeHead(201).end()

    }
},
{
    method:'DELETE',
    path:buildRoutePath('/users/:id'),
    handler: (req,res) => {
        const {id} = req.params
        console.log(id)

        database.delete('users',id)
        return res.end()
    }
},
{
    method:'PUT',
    path:buildRoutePath('/users/:id'),
    handler:(req,res)=>{
        const {id} = req.params
        const {name, email} =req.body
        //console.log(name)
        database.update('users',id,
            {name,
             email,})
        return res.end()
    }
}

]