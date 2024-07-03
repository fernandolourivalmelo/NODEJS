// import { connectToDatabaseGuia,sqlGuia} from './dataBaseSQLGuia.js';
// import { connectToDatabaseAssoc,sqlAss } from './dataBaseSQL.js';
//import { pool1, pool2 } from './dbConfig.js';



async function main() {
  // Conectando ao banco de dados
//   const connGuia = await connectToDatabaseGuia();
//   const connAssoc = await connectToDatabaseAssoc();

  // Realizando uma consulta de exemplo
  try {
//Banco Guia

                //const queryUpdate = `SELECT TOP (50) Cd_convênio, Razão_social FROM A_convenio`
                //const queryUpdate = `SELECT TOP (50) [id_grupo_area], [fk_grupo], [fk_cd_da_area] FROM [grupo_area]`
                 const queryUpdate = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
                // let result = (await connGuia.request().query(queryUpdate)).recordset;
                // result.forEach( banco =>{
                    
                //     console.log(banco.TABLE_NAME);

                // } 

                // )

               

                
                //console.log('Query =>' + result)  




    //Banco Associacao

//      const queryConv = `SELECT top 2 id_gds, nome_parceiro, site, ISNULL(desconto_em_folha, 0) as desconto_em_folha, descricao_desconto, desconto, descricao_desconto AS resume, ativo, GETDATE() AS start_date, ISNULL(todas_cidades, 0) AS type, caminho_logomarca, email, instagram, facebook, twitter,  ISNULL(atendimento_online, 0) as online  FROM [ASSOCIACAO].[cartao_beneficios].[dbo].[guia_de_servico] WHERE (ativo = 1) AND (cod_dentista = 0) AND  (Código_do_dentista = 0) AND (id_rede IS NULL) AND (nome_parceiro <> '') `


//     const result = (await connAssoc.query(queryConv)).recordset
//    // console.log(result)
//     result.forEach(async (convenio) =>{
//         const{ id_gds, nome_parceiro, site,  desconto_em_folha, descricao_desconto, desconto, resume, ativo, start_date, type, caminho_logomarca, email, instagram, facebook, twitter, online } = convenio;
//         console.log(id_gds + ' ==> ' + nome_parceiro);
//         //const queryEspecialidades = `SELECT guia_de_servico_especialidades.descricao_area, grupo_de_servico.id_grupo,  grupo_de_servico.descricao_grupo,grupo_de_servico.id_rede FROM guia_de_servico_especialidades INNER JOIN area_de_atuacao ON guia_de_servico_especialidades.cd_da_area =  area_de_atuacao.cd_da_area INNER JOIN grupo_area ON area_de_atuacao.cd_da_area = grupo_area.fk_cd_da_area INNER JOIN grupo_de_servico ON grupo_area.fk_grupo = grupo_de_servico.id_grupo  WHERE (guia_de_servico_especialidades.id_gds = `+ id_gds +`) AND  (guia_de_servico_especialidades.tipo_especialidade = 1) ORDER BY guia_de_servico_especialidades.id_gdse`

//         const queryEspecialidades = `SELECT        guia_de_servico_especialidades_1.descricao_area, grupo_de_servico_1.id_grupo, grupo_de_servico_1.descricao_grupo, grupo_de_servico_1.id_rede FROM ASSOCIACAO.cartao_beneficios.dbo.guia_de_servico_especialidades AS guia_de_servico_especialidades_1 INNER JOIN ASSOCIACAO.cartao_beneficios.dbo.area_de_atuacao AS area_de_atuacao_1 ON guia_de_servico_especialidades_1.cd_da_area = area_de_atuacao_1.cd_da_area INNER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_area AS grupo_area_1 ON area_de_atuacao_1.cd_da_area = grupo_area_1.fk_cd_da_area INNER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_de_servico AS grupo_de_servico_1 ON grupo_area_1.fk_grupo = grupo_de_servico_1.id_grupo WHERE        (guia_de_servico_especialidades_1.id_gds = `+id_gds+`) AND (guia_de_servico_especialidades_1.tipo_especialidade = 1) ORDER BY guia_de_servico_especialidades_1.id_gdse`

//         console.log(queryEspecialidades)
        
//        // const [resultadoEsp] = await sequelizeGuia.query(queryEspecialidades);
//        //const resultadoEsp = (await sql.query(queryEspecialidades)).recordset

//         const resultadoEsp = (await connAssoc.query(queryEspecialidades)).recordset //(await connAssoc.request().query(queryEspecialidades)).recordset
        
//         console.log(resultadoEsp)

   // })

  } catch (error) {
    console.error('Erro ao realizar a consulta:', error);
  } finally {
    // Fechando a conexão com o banco de dados
   // await sql.close();
    //console.log('Conexão com o banco de dados encerrada.');
  }
}

main();