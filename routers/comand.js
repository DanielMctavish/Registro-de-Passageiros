require("../app")
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../users/users")
//CARREGANDO AS COLLECTIONS - Documentos
const tripulantes = mongoose.model('tripulantes')
const passageiros = mongoose.model('passageiros')


const loginCom = "SHEPARD"
const passCom = 123



//ROTAS COMANDO

//HOME-------------------------------------------
router.get("/", (req, res) => {

    res.render("admin/home")
})
//COMANDO MENU-------------------------------------

router.get("/comando", (req, res) => {
    if (!req.session.loginCom) {
        res.render("admin/comando", {
            validateCom: true
        })
    } else {
        res.render("admin/comando", {
            _validate: true,
            _cmd_on: true,
            validateCom: false
        })
    }

})
router.post("/comando/login", (req, res) => {//LOGIN COMANDO VERIFICAÇÃO

    if (req.body.loginCom == loginCom && req.body.pass == passCom) {
        req.session.loginCom = loginCom
        if (req.session.loginCom) {
            res.render("admin/comando", {
                _validate: true,
                _cmd_on: true
            })
        }

    } else {
        res.render("admin/comando", {
            _validate: false,
            _error: true,
            validateCom: true
        })
    }
})
router.post('/logoff', (req, res) => {
    delete req.session.loginCom
    authenticate = false;
    req.body.loginCom = "";
    req.body.pass = "";
    res.render('admin/home', { _cmd_on: false })
})

router.post('/addtrip', (req, res) => {
    res.render("admin/comando", {
        validateTrip: true
    })
})

router.post('/addtrip/add', (req, res) => {//ADICIONANDO MEMBRO DA TRIPULAÇÃO--------------

    const novoTrip = mongoose.model("tripulantes")
    new novoTrip({
        date: req.body.dataNasc,
        nome: req.body.nomeTrip,
        cargo: req.body.cargoTrip,
        pass: req.body.pass
    }).save().then(() => {
        console.log('novo tripulante adicionado!');
    })

    res.render('admin/comando', {
        msgAdd: 'tripulante adicionado com sucesso',
        validateTrip: true
    })
})
router.get('/back', (req, res) => {
    res.render('admin/comando', {
        _validate: true
    })
})
//LISTA DE TRIPULANTES

router.get("/triplist", (req, res) => {

    tripulantes.find().then((novoTrip) => {
        res.render('admin/comando', {
            tripulantes: novoTrip,
            newtrip: true
        })

    })

})

router.get('/deltrip/:_id', (req, res) => {
    tripulantes.deleteOne({ _id: req.params._id }).then(() => {
        console.log('tripulante removido!');
    })
    res.redirect('/triplist')
})

//MENU TRIPULANTES

router.get('/trip', (req, res) => {
    res.render("admin/tripulantes")
})


router.post("/trip/login", (req, res) => {//LOGANDO COMO TRIPULANTE
    tripulantes.findOne({ nome: req.body.nomeTrip }).then((modeltrip) => {
        req.session.login = modeltrip;
        if (!modeltrip) {
            console.log('nenhum usuário encontrado');
            res.render("admin/tripulantes", {
                loginErr: true
            })
        } else {
            if (modeltrip.pass != req.body.passTrip) {
                res.render("admin/tripulantes", {
                    passErr: true
                })
            }
            if (modeltrip.nome == req.body.nomeTrip && modeltrip.pass == req.body.passTrip) {

                passageiros.find().sort({ _id: -1 }).then((modelPassenger) => {
                    req.session.passgmodel = modelPassenger
                    res.render("admin/tripcontrol", {
                        userName: req.session.login.nome,
                        infoPassageiro: req.session.passgmodel
                    })

                })

            }
        }
    });


    //----------------------------------------------------------------
    router.post("/trip/addpassenger/:addNome", (req, res) => {//ADD PASSAGEIROS

        //VALIDAÇÕES------------------------------------------------------------

        passageiros.findOne({ numContrato: req.body.numContrato }).then((contractPass) => {

            const passErros = [];

            if (contractPass) {
                passErros.push({ contractError: "número de contrato já existente" })
                console.log('número encontrado', contractPass);
            }

            if (passErros.length > 0) {
                let errContrc = passErros[0]
                console.log('erro encontrado', errContrc);
                res.render("admin/tripcontrol", {
                    contractError: errContrc.contractError,
                    infoPassageiro: req.session.login,
                    userName: req.session.login.nome
                })
            } else {
                console.log("Else...", passErros);
                const novPassageiro = mongoose.model("passageiros");
                new novPassageiro({
                    nome: req.body.nome,
                    email: req.body.email,
                    categoria: req.body.pasCateg,
                    numContrato: req.body.numContrato,
                    obs: req.body.obs,
                    add: req.params.addNome
                }).save().then(() => {
                    passageiros.find().then((newpassg) => {
                        req.session.passgmodel = newpassg
                        res.render("admin/tripcontrol", {
                            infoPassageiro: req.session.passgmodel,
                            userName: req.session.login.nome
                        })
                    })
                })
            }

        })

        //Excluir passageiro-------------------------------------------
        router.get("/trip/delpassenger/:_id", (req, res) => {
            passageiros.deleteOne({ _id: req.params._id }).then(() => {

                passageiros.find().then((delpass) => {
                    req.session.delpass = delpass;
                    res.render("admin/tripcontrol", {
                        infoPassageiro: req.session.delpass,
                        userName: req.session.login.nome
                    })
                })
            })
        })
    })

    //DESLOGANDO TRIPULANTE
    router.post("/trip/triplogoff", (req, res) => {
        req.session.destroy(() => {
            console.log('sessão resetada!');
        })
        res.redirect('/trip')
    })


});


//MENU PASSAGEIROS--------------------------------------------------------

router.get("/passageiros", (req, res) => {
    delete req.session.passg
    //console.log(req.session.passg);
    passageiros.find().then(el => {
        res.render("admin/passageiros", {
            passengers: el
        })
    })
})
//PESQUISANDO PASSAGEIRO--------------------------------------------------

router.post('/passageiros/find', (req, res) => {
    passageiros.find({ nome: req.body.nome }).then((nomePassag) => {
        if (!nomePassag[0]) {
            res.redirect("/passageiros")
        } else {
            req.session.passg = nomePassag;
            res.render('admin/passgDetails', {
                inforPass: req.session.passg
            })
        }
        //OLHAR OBSERVAÇÃO DO PASSAGEIRO------------------------------------------
        router.post("/passageiros/obs", (req, res) => {
            passageiros.findOne({ _id: req.body.idobs }).then(idObs => {

                res.render('admin/passgDetails', {
                    inforPass: req.session.passg,
                    obs: idObs.obs,
                    obsOn: true
                })
            })

        })

    })
})





//MENU CONFIG--------------------------------------------------------------
router.get("/config", (req, res) => {
    res.render("admin/config")
})

module.exports = router