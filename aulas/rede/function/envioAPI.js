import FormData from 'form-data';
import  { guia} from '../src/dbConfigGuia.js';
import fetch from 'node-fetch'
 
function getCurrentDateTime() {
  const now = new Date();

  // Extrai os componentes da data e hora
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses são indexados de 0 a 11
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Formata a data e hora no padrão 'YYYY-MM-DD HH:MM:SS'
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


 export async function envioAPI(id_gds,formData){

 //const FormData = new FormData(FormData);


 const dataHoraAtual = getCurrentDateTime()  
 
 
 
 //Envio para a API
       //Teste
       //const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YmMyODU2MC03NDM0LTQ0MzctODk1MC0xMDkwNzhkZDA5M2IiLCJqdGkiOiJhOTY5MjA2ZTk0ZTcwMDMyOTAyZWM2NjgzMGQ1Mzk2NjM0MDExZGNhOWFkZGQ5NGM3ZDZlZDdlNGJhZDY2ZmFiNDk3MzVhYjFhNzQ1OGZkYyIsImlhdCI6MTcxNjU2ODM1MS43NDY1ODUsIm5iZiI6MTcxNjU2ODM1MS43NDY1OSwiZXhwIjoxNzQ4MTA0MzUxLjczNjk0LCJzdWIiOiIiLCJzY29wZXMiOlsiKiJdfQ.jr-TqLmITAbGsOo3km8lVMK9XDlKeobDpJJbkT3nI2gXYmP4qR8oRvl67CUcEBwiDFFVYyr0NLa2zlGeFjNUCiEGOF4VtxmeByDaTqyQlqXeA3IOU6UCwxUjO81bZxjaRIz2BiyEZnxqL96qFMre0Ckt-r8ZZlUq-Sag9L6DN5t5coB4wnPRWa-0eSZZjObUDdhFSPHMFduQ4N3VxQ5EM6T4erjXsV17sZRkww_0jRHS3U07qHZkZaiifleomzgk9eHqAVLhYuAWdX4Z0sgXTKelkxILOfoySH8o-cAADvnbTkCYw5nmMexN2_yrOBWiSkg9jsrHTO-VvGgyFz3rWrzih5bCMxvQFnB7LCRTekZn4fHEEeKK7mYLsP9KxcvBaIpf493QoSRK4nLEre2SqlxCAuKmtzR6jCNFMLgQbaoaad6ornoi_Ey2Xi9JjkEA-4aMcB2v4a0sLPZb9ijTnlnxVFkzpj6bSQep8OFTsn1mYof2BF4-m7p6RgoMEmeF0FRcuzDM4d_1UNpicXKW8TtMtlI0Yt_3ZYKhtaahtRfwaoRCgNdx-u8OTNF3uVfMo2zuvWUToWajcXRJ7KSVsXkTHu4tYeQd5SblFUhqF7sBoIB6B4sEGsOQJ50epzE6SYNcpyrLpRjv0wWoV5qok_2slekDUlrrOcHzaqIPARs'

       //Oficial'

        const accessToken ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YzE5MWJlYy03MGI1LTQ2Y2UtOWRjYy01NzQ3MWEwMzM2YjkiLCJqdGkiOiIyMWYxYmYzMWQ2ZTk0ZWVlMDAyOWIxMmI0Mzk1Y2FjZmVjMWNhYjE0Yzg1MjhkMWU1ODFiNDlhZjk2ZDcyNjFlNjk0YjFlMDhjMjIwNmQwMCIsImlhdCI6MTcxNjQ4ODAyOS4wNjkwNTIsIm5iZiI6MTcxNjQ4ODAyOS4wNjkwNTUsImV4cCI6MTc0ODAyNDAyOS4wNTg5NSwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.A_0uK1lANFJpEmWTuJyXi0Xqo08Ey98zMSH5-AghngxUUqMfYgpgljA-My3I5uCa1xaJTRmcwlOqakiPYW48KEeH9J7qnr7xV8di3JGQnFEUc3x3xdLEiLz8Fb6KGZou56jonsMGO9OzVMHf_M6cJ9U1HWibNyZpKFlGEx2owVJQslidWGkYnxSqAUWO_lQ5ewV-qH1hotzE6l_FoIikDRY72t3jn60CUxxRrjedUppEbRWQZ5aScPqbe1ouQmAbvu28eEjlRY97hs5KRtMKYY0m9Ks2OXd86TElaLy1BRLHRTDr4PoUqD_OLgFkLj6ikBU61TnvKnJpEMCkk1Gwf_XBBwZ1l1R5y0z8SoKzNe1swhqGbLBCbNfYbop1vCk31jyRnikBTHDDflVGKCdDw0_nPVVawpzWzXcbU1gLe29YqmlYb3_ClQJa6GG4TDY6xChrolYivyBl5J9T8oX_lAmWQAQykf2_B_QCzkEXzZLGyxy4IlpjVhtgJyJlebu6prrYhsC_pVM9xjruiY8-QU_spvFP4zgWN-DeiGa1dXDQif6ZxIlGXW3mVdHLif4UmQ-H_1VQsJ8jWfyavWX5L22K3eqU9F5voJiDmiXrkK1CcEOnj07u9qscLWns-o756krTDo4oQWOBtvVo5ZYbHRT-uqnjd96LTBpcFcvIHHw'
         //Teste
        // const url = 'https://api.staging.clubeparcerias.com.br/api-client/v1/offers';
         //Oficial
         const url = 'https://clubedevantagens.abepom.org.br/api-client/v1/offers';
          const options = {
            method: 'POST',
            headers: {Accept: 'application/json', Authorization: accessToken}
          };
          options.body = formData;
        
         try {
           console.log(' ===== ENVIANDO API ===== ')  
           const response = await fetch(url, options);
           const data = await response.json();         
           const {id,slug} = data
             console.log('ID GDS =>' + id_gds );
             console.log('id Rede => ' + id);
             console.log('slug =>' + slug);
             console.log('Retorno API =>' + JSON.stringify(data))

               if(id  !== undefined){
                const queryUpdate = `UPDATE guia_de_servico SET id_rede ='`+id+`' , slug ='`+slug+`', data_envio_rede ='`+dataHoraAtual+`' , data_alteracao_rede ='`+dataHoraAtual+`' WHERE (id_gds = '`+id_gds+`')`
                 //const queryUpdate = 'SELECT TOP (50) id_grupo_area, fk_grupo, fk_cd_da_area FROM grupo_area'
                 console.log('Query =>' + queryUpdate)  
                 const result = await guia.query(queryUpdate);
               } else{
                const queryUpdate = `UPDATE guia_de_servico SET id_rede ='Erro undefined' , slug ='`+erroRetorno+`', data_envio_rede ='`+dataHoraAtual+`' , data_alteracao_rede ='`+dataHoraAtual+`'  WHERE id_gds = `+id_gds
                 console.log('Query Erro =>' + queryUpdate)  
                 const result = await guia.query(queryUpdate);
               }                    

         } catch (error) {
           let erroFormat = error

           if(error.length > 250){
             erroFormat = error.substring(0,248)
           }

          const queryUpdate = `UPDATE guia_de_servico SET id_rede ='Erro ' , slug ='`+erroFormat+`', data_envio_rede ='`+dataHoraAtual+`' , data_alteracao_rede ='`+dataHoraAtual+`' WHERE (id_gds = '`+id_gds+`')`
           //const queryUpdate = 'SELECT TOP (50) id_grupo_area, fk_grupo, fk_cd_da_area FROM grupo_area'
           const result = await guia.query(queryUpdate);
           console.error('deu erro ==> ' + error);
         }

        }
