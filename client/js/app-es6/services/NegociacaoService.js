import {HttpService} from './HttpService';
import {ConnectionFactory} from './ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService{

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


        obterNegociacoes(){

                return  Promise.all([
                                    this.obterNegociacoesDaSemana(),
                                    this.obterNegociacoesDaSemanaAnterior(),
                                    this.obterNegociacoesDaSemanaRetrasada()
                                ]).then(periodos => {

                                    let  negociacoes = periodos
                                        .reduce((dados,periodo) => dados.concat(periodo),[])
                                        .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor));
                                    return negociacoes;
                                }).catch(erro => {
                                    throw new Error(erro);
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
         
         async importa(listaAtual) {

            try {
                 let negociacoes = await this.obterNegociacoes();
             
                 return negociacoes.filter(negociacao => 
                    !listaAtual.some(negociacaoExistente => 
                   JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)));
             }
             catch (erro) {
                 console.log(erro);
                 throw new Error("Não foi possível importar as negociações");
             }
        }

    }