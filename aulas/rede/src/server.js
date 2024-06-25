import Fastify from 'fastify';
import sequelize from './database.js';
import sequelizeGuia from './databaseGuia.js';

const fastify = Fastify();

const queryConv = `SELECT top 5 id_gds, nome_parceiro, site, ISNULL(desconto_em_folha, 0) as desconto_em_folha, descricao_desconto, desconto, descricao_desconto AS resume, ativo, GETDATE() AS start_date, ISNULL(todas_cidades, 0) AS type, caminho_logomarca, email, instagram, facebook, twitter,  ISNULL(atendimento_online, 0) as online  FROM [ASSOCIACAO].[cartao_beneficios].[dbo].[guia_de_servico] WHERE (ativo = 1) AND (cod_dentista = 0) AND  (Código_do_dentista = 0) AND (id_rede IS NULL) AND (nome_parceiro <> '')` // and id_gds = 2

fastify.get('/importarConvenios', async (request, reply) => {
  try {
  
    await sequelize.authenticate();
    await sequelizeGuia.authenticate();
    const [resultado, arrayDados] = await sequelize.query(queryConv);
    //console.log(resultado)

    resultado.forEach(async (convenio) =>{
        const{ id_gds, nome_parceiro, site,  desconto_em_folha, descricao_desconto, desconto, resume, ativo, start_date, type, caminho_logomarca, email, instagram, facebook, twitter, online } = convenio
        console.log(id_gds + '-' + nome_parceiro)

        // INICIO AREAS / ESPECIALIDADE
        const queryEspecialidades = `SELECT guia_de_servico_especialidades.descricao_area, grupo_de_servico.id_grupo,  grupo_de_servico.descricao_grupo,grupo_de_servico.id_rede FROM guia_de_servico_especialidades INNER JOIN area_de_atuacao ON guia_de_servico_especialidades.cd_da_area =  area_de_atuacao.cd_da_area INNER JOIN grupo_area ON area_de_atuacao.cd_da_area = grupo_area.fk_cd_da_area INNER JOIN grupo_de_servico ON grupo_area.fk_grupo = grupo_de_servico.id_grupo  WHERE (guia_de_servico_especialidades.id_gds = `+ id_gds +`) AND  (guia_de_servico_especialidades.tipo_especialidade = 1) ORDER BY guia_de_servico_especialidades.id_gdse`
        console.log(queryEspecialidades)
        
        const [resultadoEsp] = await sequelizeGuia.query(queryEspecialidades);
        
        resultadoEsp.forEach(async(areaEspecialidade) => {
            const { descricao_area, id_rede } = areaEspecialidade
            console.log(descricao_area + '-' + id_rede)
        }
    )

    const queryEnd = `SELECT guia_de_servico_enderecos.id_gdsend, guia_de_servico_enderecos.id_gds,  guia_de_servico_enderecos.id_referencia_endereco, guia_de_servico_enderecos.endereco, guia_de_servico_enderecos.numero, guia_de_servico_enderecos.complemento,  guia_de_servico_enderecos.bairro, guia_de_servico_enderecos.cd_cidade, a_cidades_1.Nm_cidade, guia_de_servico_enderecos.cep, guia_de_servico_enderecos.latitude,  guia_de_servico_enderecos.longitude, guia_de_servico_enderecos.telefone , guia_de_servico_enderecos.whatsapp, a_cidades_1.id_rede FROM [ASSOCIACAO].[cartao_beneficios].[dbo].guia_de_servico_enderecos as guia_de_servico_enderecos INNER JOIN  ASSOCIACAO.associacao.dbo.a_cidades AS a_cidades_1 ON  guia_de_servico_enderecos.cd_cidade = a_cidades_1.Cd_cidade  WHERE (guia_de_servico_enderecos.id_gds = `+ id_gds +`)`
    const [resultadoEnd] = await sequelize.query(queryEnd)

    resultadoEnd.forEach(async (enderecoConv)=>{
        const {endereco,numero, complemento, bairro, Nm_cidade, cep, telefone , whatsapp, id_rede} = enderecoConv

        console.log(endereco + '-' +  numero + '-' +  complemento + '-' +  bairro )

    })
        


    })


    reply.status('200').send({resultado})

} catch (err) {
    reply.status(500).send({ error: 'Internal Server Error 112' + err });
  }
});

const start = async () => {
  try {
    fastify.listen({
        port:3333,
    }).then(()=>{
        console.log('Servidor rodando')
    })
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
