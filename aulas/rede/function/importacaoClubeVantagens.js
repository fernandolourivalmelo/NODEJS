import FormData from 'form-data';
import fetch from 'node-fetch'
import fs from 'fs';
import { assoc} from '../src/dbConfig.js' ;
import  { guia} from '../src/dbConfigGuia.js';
import { CharToNumber,NumberToChar } from './numberToChar.js';
import { envioAPI } from './envioAPI.js';



  //Considera a Area de atuação para personalizar a descrição
  const descricaoPersonalidade = {
    //FARMÁCIA
    4 : "Compre medicamentos com parcelamento na folha de pagamento.",
    //ÓTICA
    36 : "Compre óculos de sol e grau com parcelamento na folha de pagamento.",
    //CLINICA MÉDICA
    45 :"Consultas/Exames com especialistas descontado na folha de pagamento.",
    //ODONTOLOGIA
    6 :"Realize tratamentos odontológicos com pagamento parcelado na folha.",
    //JURÍDICO
    80:"Utilize serviços jurídicos com pagamento parcelado em até 24X na folha."

  }


function addToFormData(form, attribute, value) {
    if (value !== null && value !== undefined && value !== '') {
      //console.log(attribute +'  -  '+ value)
      form.append(attribute, value);
    }
  }


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


export async function importarConvenios(){
    await assoc.connect()
    await guia.connect()


    const now = new Date();
    console.log('Executado 01 => ' + now.toLocaleTimeString())
        
       
    const filePath = 'C:/NODEJS/aulas/rede/img/file_300_250.jpg'
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

   // const connAssocia = await connectToDatabaseAssoc();
        
    const queryConv = `SELECT top 10 id_gds, nome_parceiro, site, ISNULL(desconto_em_folha, 0) as desconto_em_folha, descricao_desconto, desconto, descricao_desconto AS resume, ativo, GETDATE() AS start_date, ISNULL(todas_cidades, 0) AS type, caminho_logomarca, email, instagram, facebook, twitter,  ISNULL(atendimento_online, 0) as online, tabela_procedimentos  FROM [guia_de_servico] WHERE (ativo = 1) AND (cod_dentista = 0) AND  (Código_do_dentista = 0) AND (id_rede IS NULL) AND (nome_parceiro <> '') `// and tabela_procedimentos = 1 `// and id_gds = '4512'`
    //console.log(queryConv)
    const resultado = (await guia.query(queryConv)).recordset
 
    console.log('=====> Quantidade de importações : ' + resultado.length + ' <===== ' )
    resultado.forEach(async (convenio) =>{
        let formData = new FormData();
        let categorias = [];
        let palavrasChave = [];
        let cidades = [];
        let beneficio = '';
        let descricao='';
        let tipoPagamento = '';

           
        const{ id_gds, nome_parceiro, site,  desconto_em_folha, descricao_desconto, desconto, resume, ativo, start_date, type, caminho_logomarca, email, instagram, facebook, twitter, online, tabela_procedimentos } = convenio;       


        const queryGrupo = `SELECT top 1 guia_de_servico_especialidades.cd_da_area, guia_de_servico_especialidades.codigo_especialidade, guia_de_servico_especialidades.descricao_area, grupo_area.fk_grupo as grupoGuia, grupo_de_servico.descricao_grupo FROM            guia_de_servico_especialidades INNER JOIN grupo_area ON guia_de_servico_especialidades.cd_da_area = grupo_area.fk_cd_da_area INNER JOIN  grupo_de_servico ON grupo_area.fk_grupo = grupo_de_servico.id_grupo WHERE   (guia_de_servico_especialidades.id_gds = `+id_gds+`) AND guia_de_servico_especialidades.tipo_especialidade = 1 ORDER BY guia_de_servico_especialidades.id_gdse`

        console.log("Grupo Guia => " + queryGrupo)
        const resultGrupo = (await guia.query(queryGrupo)).recordset
        
        let grupoArea = []  
        resultGrupo.forEach(async (grupo)=>{
          grupoArea = grupo ;
        })

        const{ cd_da_area, grupoGuia,descricao_grupo } = grupoArea
        const  CodAreaAtuacao = parseInt(cd_da_area,10)
 
        // console.log("Descricao Grupo  Guia => " + descricao_grupo)
        //console.log("Grupo Guia => " + grupoGuia)
         
        // console.log("Area Atuacao => " + CodAreaAtuacao)
        
        // if(descricaoPersonalidade[grupoGuia]){
        //   console.log("Descricao Personalizada:  " + descricaoPersonalidade[grupoGuia])
        // }else{
        //   console.log("Descricao Grupo  Guia Não localizado ")

        // }


        if (descricao_desconto !== null && descricao_desconto !== undefined && descricao_desconto !== '') {
          descricao = descricao_desconto
        }else{
          if(descricaoPersonalidade[CodAreaAtuacao]){
            descricao =  descricaoPersonalidade[CodAreaAtuacao]
          }else{
            descricao = 'Entre em contato com o conveniado ABEPOM e saiba mais sobre os benefícios' 
          }
        }

        if (desconto_em_folha) {
          tipoPagamento =  ' Desconto em Folha'
          beneficio = 'Convênio com Desconto em folha'
          
        }else{
          tipoPagamento = ' Pagamento no local'
          beneficio = 'Pagamento no local com ' + desconto + ' % de desconto'

        }

        formData.append('title',nome_parceiro)
        addToFormData(formData, 'cover',fs.createReadStream(filePath))       
        //addToFormData(formData, 'cover', 'PROVOCANDO ERRO')       
       // console.log('Descrição do desconto =>' +  descricao_desconto)
      //  console.log('Descrição =>' +  descricao)
        addToFormData(formData, 'benefit', beneficio) 
        addToFormData(formData, 'resume',  beneficio) //mostra o texto quando passa o mouse na imagem 
        formData.append('visibility','true')
        const date = new Date();
        const dateString = date.toLocaleDateString();
        console.log('Executando Importacao ==> ' + date.toLocaleTimeString())
        //console.log('Teste de DATA  ==> ' + getCurrentDateTime())
        addToFormData(formData, 'start_date',dateString)
        if(online){
          addToFormData(formData, 'type','onLine')
        }else{
          addToFormData(formData, 'type','local')
        }
        if (desconto_em_folha) { 
          addToFormData(formData, 'rescue_text','Apresente seu Cartão do Associado ABEPOM juntamente ao RG no local.')
          addToFormData(formData, 'voucher_content','Apresente seu Cartão do Associado ABEPOM juntamente ao RG no local.')
        }else{
          addToFormData(formData, 'rescue_text','Apresente seu Cartão do Associado ABEPOM juntamente ao RG e solicite o desconto de ' + desconto + ' % com o pagamento no local.')
            addToFormData(formData, 'voucher_content','Apresente seu Cartão do Associado ABEPOM juntamente ao RG e solicite o desconto de ' + desconto + ' % com o pagamento no local.')          
           
        }
       
        formData.append('invert_location_filter','false')             
        addToFormData(formData, 'priority','255')
        // INICIO AREAS / ESPECIALIDADE
        const queryEspecialidades = `SELECT guia_de_servico_especialidades_1.descricao_area, grupo_de_servico_1.id_grupo, grupo_de_servico_1.descricao_grupo, grupo_de_servico_1.id_rede, guia_de_servico_especialidades_1.tipo_especialidade FROM ASSOCIACAO.cartao_beneficios.dbo.guia_de_servico_especialidades AS guia_de_servico_especialidades_1 LEFT OUTER JOIN ASSOCIACAO.cartao_beneficios.dbo.area_de_atuacao AS area_de_atuacao_1 ON guia_de_servico_especialidades_1.cd_da_area = area_de_atuacao_1.cd_da_area LEFT OUTER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_area AS grupo_area_1 ON area_de_atuacao_1.cd_da_area = grupo_area_1.fk_cd_da_area LEFT OUTER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_de_servico AS grupo_de_servico_1 ON grupo_area_1.fk_grupo = grupo_de_servico_1.id_grupo WHERE        (guia_de_servico_especialidades_1.id_gds = `+id_gds+`) ORDER BY guia_de_servico_especialidades_1.id_gdse`

        //console.log(queryEspecialidades)
        
       const resultadoEsp = (await assoc.query(queryEspecialidades)).recordset
       categorias = []      
       palavrasChave = []
        resultadoEsp.forEach(async(areaEspecialidade) => {

                    const { tipo_especialidade, descricao_area, id_rede } = areaEspecialidade
                if (tipo_especialidade == 1){
                     categorias.push(id_rede)
                     // console.log('descricao_area_Tipo1 ==>' + descricao_area + '-' + id_rede)
                     palavrasChave.push(descricao_area)
                 }else{
                    palavrasChave.push(descricao_area)
                    //console.log('descricao_area_Tipo1 ==>' + descricao_area + '-' + id_rede)                       
                }
            }
        )
        const categoriasUnicas = [...new Set(categorias)]
        for (const value of categoriasUnicas){
            
            addToFormData(formData, 'categories[]', value)
        }

        if (tabela_procedimentos){
            const id_gds_Encriptado = await NumberToChar(''+id_gds+'')
            descricao += '<br><br><a href="https://www.abepom.org.br/guiaonline/tabela_procedimentos_clube_vantagens.asp?key='+ id_gds_Encriptado+'" target="_blank" style="padding: 10px 20px; background-color: #87CEFA; text-decoration: none;color: #000000 !important; border-radius: 20px;">Ver Tabela de Procedimentos e Valores</a>'  
        }

          if (palavrasChave.length > 0) {
            if (palavrasChave.length > 1) {
               descricao += '<br><br><i>Confira alguns de nossos serviços:</i>'
            }else{
              descricao += '<br><br><i>Serviço prestado:</i>'
            } 
               descricao += '<ul>'
          }
          for (const value of palavrasChave){
            descricao += '<li>' + value + '</li>'  
          }
          
          if (palavrasChave.length > 0) {
            descricao += '</ul>'
           }

         // console.log('Descricao ==> ' + descricao)

          const queryEnd = `SELECT guia_de_servico_enderecos.id_gdsend, guia_de_servico_enderecos.id_gds,  guia_de_servico_enderecos.id_referencia_endereco, guia_de_servico_enderecos.endereco, guia_de_servico_enderecos.numero, guia_de_servico_enderecos.complemento,  guia_de_servico_enderecos.bairro, guia_de_servico_enderecos.cd_cidade, a_cidades_1.Nm_cidade, guia_de_servico_enderecos.cep, guia_de_servico_enderecos.latitude,  guia_de_servico_enderecos.longitude, guia_de_servico_enderecos.telefone , guia_de_servico_enderecos.whatsapp, a_cidades_1.id_rede AS IdRedeCidade FROM [ASSOCIACAO].[cartao_beneficios].[dbo].guia_de_servico_enderecos as guia_de_servico_enderecos INNER JOIN  ASSOCIACAO.associacao.dbo.a_cidades AS a_cidades_1 ON  guia_de_servico_enderecos.cd_cidade = a_cidades_1.Cd_cidade  WHERE (guia_de_servico_enderecos.id_gds = `+ id_gds +`) ORDER BY id_gdsend`

          const resultadoEnd = (await assoc.query(queryEnd)).recordset
          let enderecoFormatado = ''   
          cidades = []
          let mapa = ''
          let tituloDescricaoEndereco = true
          let definirEnderecoPrincipal = true
          resultadoEnd.forEach(async (enderecoConv)=>{
                const {endereco,numero, complemento, bairro, Nm_cidade, cep, telefone , whatsapp, IdRedeCidade,latitude,longitude} = enderecoConv

                cidades.push(IdRedeCidade)

                //console.log('Endereço ==>' + id_gds + endereco  + ',' +  numero + ',' + bairro  + ',' +  Nm_cidade + '-CEP:' + cep   )
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
                    if ((longitude!== null) || (latitude!== null)){
                      mapa = '<a href="https://maps.google.com/?q='+latitude+','+longitude+'"  target="_blank"> VER NO MAPA </a>'
                      enderecoFormatado += '<br> <strong>Localização:</strong> ' + mapa
                      //console.log('Localização: ==>  ' + mapa)
                    }

                    if(definirEnderecoPrincipal){
                      definirEnderecoPrincipal = false
                      addToFormData(formData, 'contact_address',enderecoFormatado)
                    }else{
                      if (tituloDescricaoEndereco){ //condição para Colocar  o Titulo "Nossos Endereços" no campo descrição
                        tituloDescricaoEndereco = false
                        console.log('Definir Titulo')
                        descricao += '<br><br><i>Nossos Endereços:</i>'
                      }

                      descricao += '<br>' + enderecoFormatado
  
                    }

            })

        
          addToFormData(formData, 'description',descricao)

       //console.log('Endereço Formatado: ' + enderecoFormatado)     
       const locations = [... new Set(cidades)]     
       for (const value of locations){
        addToFormData(formData, 'locations[]',value)
       }
    
      
       addToFormData(formData, 'instagram_link',instagram)
       addToFormData(formData, 'facebook_link',facebook)
       addToFormData(formData, 'twitter_link',twitter)
       //addToFormData(formData, 'show_card','false')
       addToFormData(formData, 'contact_email',email)
       

       

          //Envio para a API
     envioAPI(id_gds,formData)
        
    })

            

}



export async function importarOdontologia(){
  await assoc.connect()
  await guia.connect()


  const now = new Date();
  console.log('Executado 01 => ' + now.toLocaleTimeString())
      
     
  const filePath = 'C:/NODEJS/aulas/rede/img/clubedevantagens_odontologia_logoabepom.png'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

 // const connAssocia = await connectToDatabaseAssoc();
      
  const queryConv = `SELECT top 10 id_gds, nome_parceiro, site, ISNULL(desconto_em_folha, 0) as desconto_em_folha, descricao_desconto, desconto, descricao_desconto AS resume, ativo, GETDATE() AS start_date, ISNULL(todas_cidades, 0) AS type, caminho_logomarca, email, instagram, facebook, twitter,  ISNULL(atendimento_online, 0) as online, tabela_procedimentos  FROM [guia_de_servico] WHERE (ativo = 1) AND (cod_dentista <> 0) AND (id_rede IS NULL) AND (nome_parceiro <> '') OR (ativo = 1) AND (id_rede IS NULL) AND (nome_parceiro <> '') AND (Código_do_dentista <> 0) `// and tabela_procedimentos = 1 `// and id_gds = '4512'`
  //console.log(queryConv)
  const resultado = (await guia.query(queryConv)).recordset

  console.log('=====> Quantidade de importações : ' + resultado.length + ' <===== ' )
  resultado.forEach(async (convenio) =>{
      let formData = new FormData();
      let categorias = [];
      let palavrasChave = [];
      let cidades = [];
      let beneficio = '';
      let descricao='';
      let tipoPagamento = '';

         
      const{ id_gds, nome_parceiro, site,  desconto_em_folha, descricao_desconto, desconto, resume, ativo, start_date, type, caminho_logomarca, email, instagram, facebook, twitter, online, tabela_procedimentos } = convenio;       


      const queryGrupo = `SELECT top 1 guia_de_servico_especialidades.cd_da_area, guia_de_servico_especialidades.codigo_especialidade, guia_de_servico_especialidades.descricao_area, grupo_area.fk_grupo as grupoGuia, grupo_de_servico.descricao_grupo FROM            guia_de_servico_especialidades INNER JOIN grupo_area ON guia_de_servico_especialidades.cd_da_area = grupo_area.fk_cd_da_area INNER JOIN  grupo_de_servico ON grupo_area.fk_grupo = grupo_de_servico.id_grupo WHERE   (guia_de_servico_especialidades.id_gds = `+id_gds+`) AND guia_de_servico_especialidades.tipo_especialidade = 1 ORDER BY guia_de_servico_especialidades.id_gdse`

      //console.log("Grupo Guia => " + queryGrupo)
      const resultGrupo = (await guia.query(queryGrupo)).recordset
      
      let grupoArea = []  
      resultGrupo.forEach(async (grupo)=>{
        grupoArea = grupo ;
      })

      const{ cd_da_area, grupoGuia,descricao_grupo } = grupoArea
      const  CodAreaAtuacao = parseInt(cd_da_area,10)

      // console.log("Descricao Grupo  Guia => " + descricao_grupo)
      //console.log("Grupo Guia => " + grupoGuia)
       
      // console.log("Area Atuacao => " + CodAreaAtuacao)
      
      // if(descricaoPersonalidade[grupoGuia]){
      //   console.log("Descricao Personalizada:  " + descricaoPersonalidade[grupoGuia])
      // }else{
      //   console.log("Descricao Grupo  Guia Não localizado ")

      // }


      if (descricao_desconto !== null && descricao_desconto !== undefined && descricao_desconto !== '') {
        descricao = descricao_desconto
      }else{
        if(descricaoPersonalidade[CodAreaAtuacao]){
          descricao =  descricaoPersonalidade[CodAreaAtuacao]
        }else{
          descricao = 'Realize o seu tratamento odontológico com parcelamento facilitado.' 
        }
      }

      if (desconto_em_folha) {
        tipoPagamento =  ' Desconto em Folha'
        beneficio = 'Convênio com Desconto em folha'
        
      }else{
        tipoPagamento = ' Pagamento no local'
        beneficio = 'Pagamento no local com ' + desconto + ' % de desconto'

      }

      formData.append('title',nome_parceiro)
      addToFormData(formData, 'cover',fs.createReadStream(filePath))       
      //addToFormData(formData, 'cover', 'PROVOCANDO ERRO')       
     // console.log('Descrição do desconto =>' +  descricao_desconto)
    //  console.log('Descrição =>' +  descricao)
      addToFormData(formData, 'benefit', beneficio) 
      addToFormData(formData, 'resume',  beneficio) //mostra o texto quando passa o mouse na imagem 
      formData.append('visibility','true')
      const date = new Date();
      const dateString = date.toLocaleDateString();
      console.log('Executando Importacao ==> ' + date.toLocaleTimeString())
      //console.log('Teste de DATA  ==> ' + getCurrentDateTime())
      addToFormData(formData, 'start_date',dateString)
      if(online){
        addToFormData(formData, 'type','onLine')
      }else{
        addToFormData(formData, 'type','local')
      }

      addToFormData(formData, 'rescue_text','Apresente seu Cartão do Associado ABEPOM juntamente ao RG no local.')
      addToFormData(formData, 'voucher_content','Apresente seu Cartão do Associado ABEPOM juntamente ao RG no local.')
     
      formData.append('invert_location_filter','false')             
      addToFormData(formData, 'priority','255')
      // INICIO AREAS / ESPECIALIDADE
      const queryEspecialidades = `SELECT guia_de_servico_especialidades_1.descricao_area, grupo_de_servico_1.id_grupo, grupo_de_servico_1.descricao_grupo, grupo_de_servico_1.id_rede, guia_de_servico_especialidades_1.tipo_especialidade FROM ASSOCIACAO.cartao_beneficios.dbo.guia_de_servico_especialidades AS guia_de_servico_especialidades_1 LEFT OUTER JOIN ASSOCIACAO.cartao_beneficios.dbo.area_de_atuacao AS area_de_atuacao_1 ON guia_de_servico_especialidades_1.cd_da_area = area_de_atuacao_1.cd_da_area LEFT OUTER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_area AS grupo_area_1 ON area_de_atuacao_1.cd_da_area = grupo_area_1.fk_cd_da_area LEFT OUTER JOIN                          ASSOCIACAO.cartao_beneficios.dbo.grupo_de_servico AS grupo_de_servico_1 ON grupo_area_1.fk_grupo = grupo_de_servico_1.id_grupo WHERE        (guia_de_servico_especialidades_1.id_gds = `+id_gds+`) ORDER BY guia_de_servico_especialidades_1.id_gdse`

      console.log(queryEspecialidades)
      
     const resultadoEsp = (await assoc.query(queryEspecialidades)).recordset
     categorias = []      
     palavrasChave = []
      resultadoEsp.forEach(async(areaEspecialidade) => {
          const { tipo_especialidade, descricao_area, id_rede } = areaEspecialidade
          console.log('DEscrição Area  ==> ' + descricao_area)
          const  especialidade = descricao_area.split("-")         
            if (especialidade[1] !== undefined){
              console.log('Especialidade ==> ' + especialidade[1] ) //especialidade(1))
              palavrasChave.push(especialidade[1])
            }  
        }


      )

      //Fixo Odontologia       
      addToFormData(formData, 'categories[]', '9c268cbc-a90f-4e67-99bc-415da580e888')

      if (tabela_procedimentos){
          const id_gds_Encriptado = await NumberToChar(''+id_gds+'')
          descricao += '<br><br><a href="https://www.abepom.org.br/guiaonline/tabela_procedimentos_clube_vantagens.asp?key='+ id_gds_Encriptado+'" target="_blank" style="padding: 10px 20px; background-color: #87CEFA; text-decoration: none;color: #000000 !important; border-radius: 20px;">Ver Tabela de Procedimentos e Valores</a>'  
      }

        if (palavrasChave.length > 0) {
          if(palavrasChave.length > 1){
            descricao += '<br><br><i>Especialidades:</i>'
          }else{
            descricao += '<br><br><i>Especialidade:</i>'

          }

          descricao += '<ul>'
        }

        for (const value of palavrasChave){
          descricao += '<li>' + value + '</li>'  
        }
        
        if (palavrasChave.length > 0) {
          descricao += '</ul>'
         }

        console.log('Descricao ==> ' + descricao)

        const queryEnd = `SELECT guia_de_servico_enderecos.id_gdsend, guia_de_servico_enderecos.id_gds,  guia_de_servico_enderecos.id_referencia_endereco, guia_de_servico_enderecos.endereco, guia_de_servico_enderecos.numero, guia_de_servico_enderecos.complemento,  guia_de_servico_enderecos.bairro, guia_de_servico_enderecos.cd_cidade, a_cidades_1.Nm_cidade, guia_de_servico_enderecos.cep, guia_de_servico_enderecos.latitude,  guia_de_servico_enderecos.longitude, guia_de_servico_enderecos.telefone , guia_de_servico_enderecos.whatsapp, a_cidades_1.id_rede AS IdRedeCidade FROM [ASSOCIACAO].[cartao_beneficios].[dbo].guia_de_servico_enderecos as guia_de_servico_enderecos INNER JOIN  ASSOCIACAO.associacao.dbo.a_cidades AS a_cidades_1 ON  guia_de_servico_enderecos.cd_cidade = a_cidades_1.Cd_cidade  WHERE (guia_de_servico_enderecos.id_gds = `+ id_gds +`) ORDER BY id_gdsend`

        const resultadoEnd = (await assoc.query(queryEnd)).recordset
        let enderecoFormatado = ''   
        cidades = []
        let mapa = ''
        let tituloDescricaoEndereco = true
        let definirEnderecoPrincipal = true
        resultadoEnd.forEach(async (enderecoConv)=>{
              const {endereco,numero, complemento, bairro, Nm_cidade, cep, telefone , whatsapp, IdRedeCidade,latitude,longitude} = enderecoConv

              cidades.push(IdRedeCidade)

              //console.log('Endereço ==>' + id_gds + endereco  + ',' +  numero + ',' + bairro  + ',' +  Nm_cidade + '-CEP:' + cep   )
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
                  if ((longitude!== null) || (latitude!== null)){
                    mapa = '<a href="https://maps.google.com/?q='+latitude+','+longitude+'"  target="_blank"> VER NO MAPA </a>'
                    enderecoFormatado += '<br> <strong>Localização:</strong> ' + mapa
                    //console.log('Localização: ==>  ' + mapa)
                  }

                  if(definirEnderecoPrincipal){
                    definirEnderecoPrincipal = false
                    addToFormData(formData, 'contact_address',enderecoFormatado)
                  }else{
                    if (tituloDescricaoEndereco){ //condição para Colocar  o Titulo "Nossos Endereços" no campo descrição
                      tituloDescricaoEndereco = false
                      console.log('Definir Titulo')
                      descricao += '<br><br><i>Nossos Endereços:</i>'
                    }

                    descricao += '<br>' + enderecoFormatado

                  }

          })

      
        addToFormData(formData, 'description',descricao)

     //console.log('Endereço Formatado: ' + enderecoFormatado)     
     const locations = [... new Set(cidades)]     
     for (const value of locations){
      addToFormData(formData, 'locations[]',value)
     }
  
    
     addToFormData(formData, 'instagram_link',instagram)
     addToFormData(formData, 'facebook_link',facebook)
     addToFormData(formData, 'twitter_link',twitter)
     //addToFormData(formData, 'show_card','false')
     addToFormData(formData, 'contact_email',email)

     //Envio para a API
     envioAPI(id_gds,formData)
    
  })

          

}