import sql from 'mssql';

const dbConfig1 = {
  user: 'sa',
   password: '3Ds3Guro',
   server: '192.168.1.8',
  // password: 'abepom',
  // server: '192.168.1.34',

  database: 'associacao',
  options: {
    encrypt: false, // Use this if you're on Windows Azure
    trustServerCertificate: false // For self-signed certificates
  },
     pool: {
      max: 10, // Número máximo de conexões na pool
      min: 0, // Número mínimo de conexões na pool
      idleTimeoutMillis: 30000 // Tempo máximo em milissegundos que uma conexão pode ficar inativa antes de ser fechada
    }

};

let assoc = new sql.ConnectionPool(dbConfig1);

async function connectToDb(config) {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to database:', config.database);
    console.log('Pass:', config.password);
    console.log('server:', config.server);
    console.log('Conectado:', pool.connected);
    
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

async function initializeConnections() {
  try {
    assoc = await connectToDb(dbConfig1);
    console.error('CONEXÕES ATIVADAS');

} catch (err) {
    console.error('Error initializing database connections:', err);
    process.exit(1);
  }
}

//initializeConnections();
assoc.connect().then(()=>{
    console.log('Conectado assossiacao')
})
export { assoc };
