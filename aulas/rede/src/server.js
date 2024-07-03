import Fastify from 'fastify';
import FormData from 'form-data';
import fetch from 'node-fetch'
import fs from 'fs';
import { assoc} from './dbConfig.js';
import { guia} from './dbConfigGuia.js';

const fastify = Fastify();//{logger:true}

 // and id_gds = 2

 fastify.get('/teste', async (req,reply)=>{


      //const queryUpdate = `SELECT TOP (50) Cd_convênio, Razão_social FROM A_convenio`
      //const queryUpdate = `SELECT TOP (50) [id_grupo_area], [fk_grupo], [fk_cd_da_area] FROM [grupo_area]`
      const queryUpdate = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
      let result1 = (await assoc.request().query(queryUpdate)).recordset;
      result1.forEach( banco =>{
          console.log(banco.TABLE_NAME);
          } 
      )

      console.log(' ============= CONEXÃO BANCO GUIA ONLINE ============= ')
      let result = (await pool2.query(queryUpdate)).recordset;
      result.forEach( banco =>{
          console.log(banco.TABLE_NAME);
          } 
      )


  reply.status('200').send('conectado')


 })

fastify.get('/importarConvenios', async (request, reply) => {
  try {
    let formData = new FormData();
    let categorias = [];
    let palavrasChave = [];
    let beneficio = '';
    let descricao='';
    let tipoPagamento = '';
        
    const filePath = 'C:/NODEJS/aulas/rede/img/file_300_250.jpg'
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

   // const connAssocia = await connectToDatabaseAssoc();
    

    
    function addToFormData(form, attribute, value) {
      if (value !== null && value !== undefined && value !== '') {
        //console.log(attribute +'  -  '+ value)
        form.append(attribute, value);
      }
    }



    const queryConv = `SELECT top 10 id_gds, nome_parceiro, site, ISNULL(desconto_em_folha, 0) as desconto_em_folha, descricao_desconto, desconto, descricao_desconto AS resume, ativo, GETDATE() AS start_date, ISNULL(todas_cidades, 0) AS type, caminho_logomarca, email, instagram, facebook, twitter,  ISNULL(atendimento_online, 0) as online  FROM [ASSOCIACAO].[cartao_beneficios].[dbo].[guia_de_servico] WHERE (ativo = 1) AND (cod_dentista = 0) AND  (Código_do_dentista = 0) AND (id_rede IS NULL) AND (nome_parceiro <> '') and id_gds = '5'`
    //console.log(queryConv)

     

    // await sequelize.authenticate();
    // await sequelizeGuia.authenticate();
    // const [resultado, arrayDados] = await sequelize.query(queryConv);
    const resultado = (await assoc.query(queryConv)).recordset
    //console.log('Apos SQL')

    

    resultado.forEach(async (convenio) =>{
        const{ id_gds, nome_parceiro, site,  desconto_em_folha, descricao_desconto, desconto, resume, ativo, start_date, type, caminho_logomarca, email, instagram, facebook, twitter, online } = convenio;
        //console.log(id_gds + '-' + nome_parceiro);

        

        if (descricao_desconto !== null && descricao_desconto !== undefined && descricao_desconto !== '') {
          descricao = descricao_desconto
        }else{
          descricao = 'Entre em contato com o conveniado ABEPOM e saiba mais sobre os benefícios'
        }
        if (desconto_em_folha) {
          tipoPagamento +=  ' Desconto em Folha'
          
        }else{
          tipoPagamento += ' Pagamento no local'
        }

        beneficio = 'Apresente o cartão do Associado ABEPOM.<br>'
        beneficio += "Conveniado ABEPOM com " + tipoPagamento
        beneficio += descricao


        

        //addToFormData(formData, 'title',nome_parceiro)
        formData.append('title',nome_parceiro)
        addToFormData(formData, 'cover',fs.createReadStream(filePath))       
        console.log('Descrição do desconto =>' +  descricao_desconto)
        addToFormData(formData, 'benefit',beneficio) 
        addToFormData(formData, 'resume', descricao) //mostra o texto quando passa o mouse na imagem 
        formData.append('visibility','true')
        const date = new Date();
        const dateString = date.toLocaleDateString();
        console.log('Data ==>' + dateString)
        addToFormData(formData, 'start_date',dateString)
        if(online){
          addToFormData(formData, 'type','onLine')
        }else{
          addToFormData(formData, 'type','local')
        }
        if (desconto_em_folha) {
          addToFormData(formData, 'rescue_text','Desconto em Folha')
        }else{
          addToFormData(formData, 'rescue_text','Pagamento no local')
        }

        formData.append('invert_location_filter','false')             
        addToFormData(formData, 'priority','255')
        // console.log(JSON.stringify(form))

        // INICIO AREAS / ESPECIALIDADE
              const queryEspecialidades = `SELECT        guia_de_servico_especialidades_1.descricao_area, grupo_de_servico_1.id_grupo, grupo_de_servico_1.descricao_grupo, grupo_de_servico_1.id_rede, guia_de_servico_especialidades_1.tipo_especialidade FROM ASSOCIACAO.cartao_beneficios.dbo.guia_de_servico_especialidades AS guia_de_servico_especialidades_1 LEFT OUTER JOIN ASSOCIACAO.cartao_beneficios.dbo.area_de_atuacao AS area_de_atuacao_1 ON guia_de_servico_especialidades_1.cd_da_area = area_de_atuacao_1.cd_da_area LEFT OUTER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_area AS grupo_area_1 ON area_de_atuacao_1.cd_da_area = grupo_area_1.fk_cd_da_area LEFT OUTER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_de_servico AS grupo_de_servico_1 ON grupo_area_1.fk_grupo = grupo_de_servico_1.id_grupo WHERE        (guia_de_servico_especialidades_1.id_gds = `+id_gds+`) ORDER BY guia_de_servico_especialidades_1.id_gdse`

        console.log(queryEspecialidades)
        
       // const [resultadoEsp] = await sequelizeGuia.query(queryEspecialidades);
       //const resultadoEsp = (await sql.query(queryEspecialidades)).recordset

       const resultadoEsp = (await assoc.query(queryEspecialidades)).recordset
       categorias = []
       palavrasChave = []
                resultadoEsp.forEach(async(areaEspecialidade) => {

                    const { tipo_especialidade, descricao_area, id_rede } = areaEspecialidade
                    if (tipo_especialidade == 1){
                        categorias.push(id_rede)
                        console.log('descricao_area_Tipo1 ==>' + descricao_area + '-' + id_rede)
                      }else{
                        palavrasChave.push(descricao_area)
                        console.log('descricao_area_Tipo1 ==>' + descricao_area + '-' + id_rede)
                        
                      }
                  }
                )
          console.log('Catagorias no Array: ' + JSON.stringify(categorias))
          console.log('Palavras Chaves: ' + JSON.stringify(palavrasChave))

          for (const value of categorias){
            addToFormData(formData, 'categories[]', value)
          }

          if (palavrasChave.length > 0) {
            descricao += "<br>Confira alguns de nossos serviços:<br>"
          }
          for (const value of palavrasChave){
            descricao += value + '<br>'
          }
          addToFormData(formData, 'description',descricao)
          console.log('Descricao ==> ' + descricao)

            const queryEnd = `SELECT guia_de_servico_enderecos.id_gdsend, guia_de_servico_enderecos.id_gds,  guia_de_servico_enderecos.id_referencia_endereco, guia_de_servico_enderecos.endereco, guia_de_servico_enderecos.numero, guia_de_servico_enderecos.complemento,  guia_de_servico_enderecos.bairro, guia_de_servico_enderecos.cd_cidade, a_cidades_1.Nm_cidade, guia_de_servico_enderecos.cep, guia_de_servico_enderecos.latitude,  guia_de_servico_enderecos.longitude, guia_de_servico_enderecos.telefone , guia_de_servico_enderecos.whatsapp, a_cidades_1.id_rede AS IdRedeCidade FROM [ASSOCIACAO].[cartao_beneficios].[dbo].guia_de_servico_enderecos as guia_de_servico_enderecos INNER JOIN  ASSOCIACAO.associacao.dbo.a_cidades AS a_cidades_1 ON  guia_de_servico_enderecos.cd_cidade = a_cidades_1.Cd_cidade  WHERE (guia_de_servico_enderecos.id_gds = `+ id_gds +`)`
            console.log(queryEnd)
            //const [resultadoEnd] = await sequelize.query(queryEnd)
            const resultadoEnd = (await assoc.query(queryEnd)).recordset
            let enderecoFormatado = ''   
            let cidades = []
            let mapa = ''
            resultadoEnd.forEach(async (enderecoConv)=>{
                const {endereco,numero, complemento, bairro, Nm_cidade, cep, telefone , whatsapp, IdRedeCidade,latitude,longitude} = enderecoConv

                cidades.push(IdRedeCidade)

              console.log('Endereço ==>' + id_gds + endereco  + ',' +  numero + ',' + bairro  + ',' +  Nm_cidade + '-CEP:' + cep   )
                enderecoFormatado =  endereco  + ',' +  numero + ',' + bairro  + ',' +  Nm_cidade + '-CEP:' + cep  + ' Fone: ' 
                
                    if (telefone !== '') {
                      enderecoFormatado +=  telefone
                    }
          
                    if (whatsapp !== '') {
                      if (telefone !== ''){
                       //telefoneW = whatsapp
                        enderecoFormatado +=  '/' +  whatsapp
                      }else{
                        enderecoFormatado +=  whatsapp
                      }
                    }

                    if (mapa == ''){
                      if ((longitude!== null) || (latitude!== null)){
                        mapa = `https://maps.google.com/?q=`+ latitude +`,`+ longitude                     
                        //enderecoFormatado += '<br> MAPA: ' + mapa
                      }
                  }
    
          })

          console.log('Cidades no Array ==> ' + JSON.stringify(cidades))
          console.log('MAPA ==>  ' + mapa)
       //console.log('Endereço Formatado: ' + enderecoFormatado)     

       for (const value of cidades){
        addToFormData(formData, 'locations[]',value)
       }
    
       addToFormData(formData, 'contact_address',enderecoFormatado)
       addToFormData(formData, 'instagram_link',instagram)
       addToFormData(formData, 'facebook_link',facebook)
       addToFormData(formData, 'twitter_link',twitter)
       addToFormData(formData, 'show_card','false')
       addToFormData(formData, 'contact_email',email)

       //Envio para a API

       //Teste
        const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YmMyODU2MC03NDM0LTQ0MzctODk1MC0xMDkwNzhkZDA5M2IiLCJqdGkiOiJhOTY5MjA2ZTk0ZTcwMDMyOTAyZWM2NjgzMGQ1Mzk2NjM0MDExZGNhOWFkZGQ5NGM3ZDZlZDdlNGJhZDY2ZmFiNDk3MzVhYjFhNzQ1OGZkYyIsImlhdCI6MTcxNjU2ODM1MS43NDY1ODUsIm5iZiI6MTcxNjU2ODM1MS43NDY1OSwiZXhwIjoxNzQ4MTA0MzUxLjczNjk0LCJzdWIiOiIiLCJzY29wZXMiOlsiKiJdfQ.jr-TqLmITAbGsOo3km8lVMK9XDlKeobDpJJbkT3nI2gXYmP4qR8oRvl67CUcEBwiDFFVYyr0NLa2zlGeFjNUCiEGOF4VtxmeByDaTqyQlqXeA3IOU6UCwxUjO81bZxjaRIz2BiyEZnxqL96qFMre0Ckt-r8ZZlUq-Sag9L6DN5t5coB4wnPRWa-0eSZZjObUDdhFSPHMFduQ4N3VxQ5EM6T4erjXsV17sZRkww_0jRHS3U07qHZkZaiifleomzgk9eHqAVLhYuAWdX4Z0sgXTKelkxILOfoySH8o-cAADvnbTkCYw5nmMexN2_yrOBWiSkg9jsrHTO-VvGgyFz3rWrzih5bCMxvQFnB7LCRTekZn4fHEEeKK7mYLsP9KxcvBaIpf493QoSRK4nLEre2SqlxCAuKmtzR6jCNFMLgQbaoaad6ornoi_Ey2Xi9JjkEA-4aMcB2v4a0sLPZb9ijTnlnxVFkzpj6bSQep8OFTsn1mYof2BF4-m7p6RgoMEmeF0FRcuzDM4d_1UNpicXKW8TtMtlI0Yt_3ZYKhtaahtRfwaoRCgNdx-u8OTNF3uVfMo2zuvWUToWajcXRJ7KSVsXkTHu4tYeQd5SblFUhqF7sBoIB6B4sEGsOQJ50epzE6SYNcpyrLpRjv0wWoV5qok_2slekDUlrrOcHzaqIPARs'

        //Oficial'

        // const accessToken ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YzE5MWJlYy03MGI1LTQ2Y2UtOWRjYy01NzQ3MWEwMzM2YjkiLCJqdGkiOiIyMWYxYmYzMWQ2ZTk0ZWVlMDAyOWIxMmI0Mzk1Y2FjZmVjMWNhYjE0Yzg1MjhkMWU1ODFiNDlhZjk2ZDcyNjFlNjk0YjFlMDhjMjIwNmQwMCIsImlhdCI6MTcxNjQ4ODAyOS4wNjkwNTIsIm5iZiI6MTcxNjQ4ODAyOS4wNjkwNTUsImV4cCI6MTc0ODAyNDAyOS4wNTg5NSwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.A_0uK1lANFJpEmWTuJyXi0Xqo08Ey98zMSH5-AghngxUUqMfYgpgljA-My3I5uCa1xaJTRmcwlOqakiPYW48KEeH9J7qnr7xV8di3JGQnFEUc3x3xdLEiLz8Fb6KGZou56jonsMGO9OzVMHf_M6cJ9U1HWibNyZpKFlGEx2owVJQslidWGkYnxSqAUWO_lQ5ewV-qH1hotzE6l_FoIikDRY72t3jn60CUxxRrjedUppEbRWQZ5aScPqbe1ouQmAbvu28eEjlRY97hs5KRtMKYY0m9Ks2OXd86TElaLy1BRLHRTDr4PoUqD_OLgFkLj6ikBU61TnvKnJpEMCkk1Gwf_XBBwZ1l1R5y0z8SoKzNe1swhqGbLBCbNfYbop1vCk31jyRnikBTHDDflVGKCdDw0_nPVVawpzWzXcbU1gLe29YqmlYb3_ClQJa6GG4TDY6xChrolYivyBl5J9T8oX_lAmWQAQykf2_B_QCzkEXzZLGyxy4IlpjVhtgJyJlebu6prrYhsC_pVM9xjruiY8-QU_spvFP4zgWN-DeiGa1dXDQif6ZxIlGXW3mVdHLif4UmQ-H_1VQsJ8jWfyavWX5L22K3eqU9F5voJiDmiXrkK1CcEOnj07u9qscLWns-o756krTDo4oQWOBtvVo5ZYbHRT-uqnjd96LTBpcFcvIHHw'
          //Teste
          const url = 'https://api.staging.clubeparcerias.com.br/api-client/v1/offers';
          //Oficial
          //const url = 'https://clubedevantagens.abepom.org.br/api-client/v1/offers';
           const options = {
             method: 'POST',
             headers: {Accept: 'application/json', Authorization: accessToken}
           };
           options.body = formData;
         
          // try {
          //   const response = await fetch(url, options);
          //   const data = await response.json();            
          //    const {id,slug} = data
          //       console.log('ID GDS =>' + id_gds );
          //       console.log('id Rede => ' + id);
          //       console.log('slug =>' + slug);
          //       console.log(data);
          //       //const connGuia = await connectToDatabaseGuia();
          //       if(id  !== undefined){
          //         const queryUpdate = `UPDATE guia_de_servico SET id_rede ='`+id+`' , slug ='`+slug+`' WHERE (id_gds = '`+id_gds+`')`
          //         //const queryUpdate = 'SELECT TOP (50) id_grupo_area, fk_grupo, fk_cd_da_area FROM grupo_area'
          //         console.log('Query =>' + queryUpdate)  
          //         const result = await guia.query(queryUpdate);
          //         console.log('Resultado UPDATE =>' + result)
          //       }                     

          // } catch (error) {
          //   console.error(error);
          // }
        
    })


    reply.status('200').send({resultado})

} catch (err) {
    reply.status(500).send({ error: 'Internal Server Error 112' + err });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3333 });
    //fastify.log.info('Server listening on http://localhost:3333');
    
  } catch (err) {
    //fastify.log.error(err);
    process.exit(1);
  }
};

start().then(()=>{
  console.log('Servidor rodando')
});
