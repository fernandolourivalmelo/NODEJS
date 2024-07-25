import fastify from 'fastify'
import 'dotenv/config'
import  crypto from 'crypto';
import {env, sqlAss} from '../database/dataBaseSQL'


const app = fastify()

// GET,POST,PUT PATCH, DELETE


function encrypt (text: string, secretKey: string){
    const iv = crypto.randomBytes(16); //vetor de inicializacao
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey),iv);
    let encrypted =cipher.update(text, 'utf8','hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string, secretKey: string) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }



app.get('/', (request, reply) => {
  // Exemplo de uso
const secretKey = crypto.randomBytes(32); // Chave secreta de 256 bits
const textToEncrypt = '002846000110456';
const encryptedText = encrypt(textToEncrypt, secretKey);
console.log('Texto Criptografado:', encryptedText);
  
  reply
    .status(200)
    .send('Rota padrão Get ==>  ' + new Date().toLocaleTimeString())
})







app.listen({
    port: 3333,
  })
  .then(() => {
    //console.log('Process.env ==> ' + JSON.stringify(process.env))
    console.log('Server is Running!')
  })
