import  crypto from 'crypto';

export function encrcypt (text: string, secretKey: string){
    const iv = crypto.randomBytes(16); //vetor de inicializacao
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey),iv);
    let encrypted =cipher.update(text, 'utf8','hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}



