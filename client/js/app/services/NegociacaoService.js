class NegociacaoService{

    constructor(){
        this._http = new HttpService();
     
    }

    obterNegociacoesDaSemana(){
        return new Promise((resolve,reject) => {
            this._http
            .get('negociacoes/semana')
            .then(negociacoes =>
                {
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade,objeto.valor)));
                })
                .catch(erro =>{
                    console.log(erro);
                    reject('Não foi possivel obter a negociacao da semana.');
                })
            
             });
          }
                     
            obterNegociacoesDaSemanaAnterior(){

                return new Promise((resolve,reject) => {
                    this._http
                    .get('negociacoes/anterior')
                    .then(negociacoes =>
                        {
                            resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade,objeto.valor)));
                        })
                        .catch(erro =>{
                            console.log(erro);
                            reject('Não foi possivel obter a negociacao da semana anterior.');
                        })
                    
                     });                  
            }

            obterNegociacoesDaSemanaRetrasada(){
       
                return new Promise((resolve,reject) => {
                    this._http
                    .get('negociacoes/retrasada')
                    .then(negociacoes =>
                        {
                            resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade,objeto.valor)));
                        })
                        .catch(erro =>{
                            console.log(erro);
                            reject('Não foi possivel obter a negociacao da semana retrasada.');
                        })
                    
                     });  

        }

        cadastra(negociacao){

            return   ConnectionFactory
                    .getConnection()
                    .then(connection => new NegociacaoDao(connection))
                    .then(dao => dao.adiciona(negociacao))
                    .then(() => 'Negociação adicionada com sucesso')
                    .catch(() => { 
                        throw new Error('Não foi possivel adicionar a negocição')
                        });  
                   }

         lista(){

            return   ConnectionFactory
                    .getConnection()
                    .then(connection => new NegociacaoDao(connection))
                    .then(dao => dao.listaTodos())
                    .catch(erro =>{
                        throw new Error('Não foi possivel obter as negociações')
                    })
         }    
         
         apaga(){
          return  ConnectionFactory
                .getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.apagaTodos())
                .then(() => 'Negociações apagadas com sucesso')
                .catch(erro => {
                throw new Error('Não foi possivel apagar as negociações')
            });         
         } 
         
         importa(listaAtual){

        return  this.obterNegociacoesDaSemana()
                    .then(negociacoes =>
                            negociacoes.filter(negociacao =>
                            !listaAtual.some(negociacaoExistente =>
                                negociacao.isEquals(negociacaoExistente)))
                                    //JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))                    
                        )
                    .catch(erro => {
                                    throw new Error('Não foi possivel buscar negociações para importar');
                                })
         }
    }