import { Sequelize } from 'sequelize';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const sequelize = new Sequelize('associacao', 'sa', 'abepom', {
  host: '192.168.1.34',
  dialect: 'mssql',
  port:1433,
   dialectOptions: {
     options: {      
       encrypt: false, // Use this if you're on Windows Azure
       trustServerCertificate: false, // Use this for local dev/self-signed certs
     }
   }
 ,
  version: '7.4' ,
  logging: false // Disable logging; default: console.log
});


const sequelizeGuia = new Sequelize('cartao_beneficios', 'sa', 'abepom', {
    host: '192.168.1.34',
    dialect: 'mssql',
    port:1433,
     dialectOptions: {
       options: {      
         encrypt: false, // Use this if you're on Windows Azure
         trustServerCertificate: false, // Use this for local dev/self-signed certs
       }
     }
   ,
    version: '7.4' ,
    logging: false // Disable logging; default: console.log
  });


export default sequelize