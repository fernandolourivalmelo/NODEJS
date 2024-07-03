import sqlAss from 'mssql';

// Configuração do banco de dados
const config = {
  user: 'sa',
  password: 'abepom',
  server: '192.168.1.34',
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

export { connectToDatabaseAssoc, sqlAss };