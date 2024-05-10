
import fs from 'node:fs/promises'


const dataBasePath = new URL('../db.json', import.meta.url)

export class dataBase {
    #database={}

constructor(){
    fs.readFile(dataBasePath,'utf8')
    .then(data =>{
        this.#database = JSON.parse(data)
    }).catch(()=>{
        this.#persist()
    })
}   

    #persist(){
        fs.writeFile(dataBasePath, JSON.stringify(this.#database))
    }

    select(table){
        const data = this.#database[table]??[]

        return data
    }

    insert(table,data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else{
            this.#database[table] = [data]
        }

        this.#persist()
        return data
    }

    delete(table,id){
        const rowIndex = this.#database[table].findIndex(row => row.id ==id)
        if(rowIndex >-1){
            this.#database[table].splice(rowIndex,1)
            this.#persist()
        }
    }

    update (table,id,data){
        const rowIndex = this.#database[table].findIndex(row => row.id ==id)
        console.log(`index:`+rowIndex)
        if(rowIndex>-1){           
            this.#database[table][rowIndex] = {id,...data}
            this.#persist()
        }
    }

  
}