

const mapeamentoNTI = {'x':0,'y':1,'w':2,'d':3,'a':4,'l':5,'b':6,'p':7,'m':8,'q':9}
const mapeamentoAssoc = {'k':0,'j':1,'h':2,'g':3,'m':4,'x':5,'z':6,'q':7,'w':8,'y':9}




const mapeamentoInverso = {};

for (const [char,num] of Object.entries(mapeamentoAssoc)){
    mapeamentoInverso[num]=char
}


export async function  CharToNumber(texto) {
  return texto.split('').map (char=>{
    const lowerChar = char.toLowerCase();
    return mapeamentoAssoc[lowerChar] !== undefined ? mapeamentoAssoc[lowerChar]:char;
}).join('');
    
}

export async function NumberToChar(numero) {
    return numero.split('').map (num=>{
        const numero = parseInt(num,10);
        return mapeamentoInverso[numero] !== undefined ? mapeamentoInverso[numero]:num;
    }).join('');
        
    }




