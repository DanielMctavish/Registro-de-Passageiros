const localstrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//model de usuario.....
require("../users/users")

const tripulantes = mongoose.model("tripulantes") //importando documento-----------

module.exports = function (passport) {
    passport.use(new localstrategy({ usernameField: 'nome' }, (email, pass, done) => {
        tripulantes.findOne({ email: email }).then((trip) => {
            if (!trip) {
                return done(null, false, { message: "esta conta não existe" })
            }
            bcrypt.compare(pass, trip.pass, (erro, batem) => {
                if (batem) {
                    return done(null, trip)
                } else {
                    return done(null, false, { message: "senha incorreta!" })
                }
            })
        })
    }))

    passport.serializeUser((tripulante, done) => {
        done(null, tripulante.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, tripulante) => {
            done(err, user)
        })
    })
}