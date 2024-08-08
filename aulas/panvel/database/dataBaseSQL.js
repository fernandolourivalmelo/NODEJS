import 'dotenv/config'
import sqlAss from 'mssql';
import {z} from 'zod'


const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASS: z.string(),
  SECRET_KEY: z.string()
})

// Configuração do banco de dados

const env = envSchema.parse(process.env)

const config = {
  user: env.DATABASE_USER,
  password: env.DATABASE_PASS,
  server: env.DATABASE_URL,
  database: 'associacao',
  options: {
    encrypt: false, // Use isso se estiver usando o Azure SQL
    trustServerCertificate: false, // Apenas para desenvolvimento
  }
};

// Função para conectar ao banco de dados
async function connectToDatabaseAssoc() {
  try {
    const pool1 = await sqlAss.connect(config);
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return pool1;
} catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

export { connectToDatabaseAssoc, sqlAss , env};