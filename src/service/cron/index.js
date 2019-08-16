const CronJob = require('cron').CronJob,
    { obterInfoProJobOrganizarFB } = require('../../repository/api/estabelecimento'),
    { alterarItemLojaStatusFirebase } = require('../../repository/api/itemLoja'),
    { alterarDesafioStatusFirebase } = require('../../repository/api/desafio'),
    { FBAdicionarItemEstabelecimento, FBRemoverItemEstabelecimento, FBCadastrarDesafio, FBRemoverDesafio } = require('../firebase/estabelecimento');

exports.Job = () => {
    const job = new CronJob('0 * * * * * ', async () => {
        const infoOrganizar = await obterInfoProJobOrganizarFB();

        if (typeof infoOrganizar !== 'undefined')
        {
            infoOrganizar.estabelecimentos.map(function(estabelecimento){

                if (typeof estabelecimento.itensLoja !== 'undefined')
                {
                    estabelecimento.itensLoja.map(function(itemLoja) {
                        if (itemLoja.adicionar === 1){
                            FBAdicionarItemEstabelecimento(estabelecimento._id, itemLoja); //adiciona o item ao firebase
                            alterarItemLojaStatusFirebase(itemLoja._id, 1); //altera status no mongo dizendo que este ja foi adicionado
                        }

                        if (itemLoja.remover === 1){
                            FBRemoverItemEstabelecimento(estabelecimento._id, itemLoja._id); //remove item do firebase
                            alterarItemLojaStatusFirebase(itemLoja._id, 2); //altera o status no mongo dizendo que este ja foi removido
                        }
                    });
                }

                if (typeof estabelecimento.desafios !== 'undefined')
                {
                    estabelecimento.desafios.map(function(desafio) {
                        if (desafio.adicionar === 1){
                            FBCadastrarDesafio(estabelecimento._id, desafio.premio.produto, desafio.objetivo.produto, desafio); //adiciona o desafio ao firebase
                            alterarDesafioStatusFirebase(desafio._id, 1); //altera status no mongo dizendo que este ja foi adicionado
                        }

                        if (desafio.remover === 1){
                            FBRemoverDesafio(estabelecimento._id, desafio._id); //remove desafio do firebase
                            alterarDesafioStatusFirebase(desafio._id, 2); //altera o status no mongo dizendo que este ja foi removido
                        }
                    });
                }

            });
        }
    });
    job.start();
};