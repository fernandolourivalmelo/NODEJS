import sqlGuia from 'mssql';

// Configuração do banco de dados
const config = {
  user: 'sa',
  password: 'abepom',
  server: '192.168.1.34',
  database: 'cartao_beneficios',
  options: {
    encrypt: false, // Use isso se estiver usando o Azure SQL
    trustServerCertificate: false, // Apenas para desenvolvimento
  }
};

// Função para conectar ao banco de dados
async function connectToDatabaseGuia() {
  try {
    const pool1 = await sqlGuia.connect(config);
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return pool1;
} catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

export { connectToDatabaseGuia, sqlGuia };