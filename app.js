const express = require('express')
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
//require("./config/auth")(passport)

//Sessão---------

app.use(session({
    secret: "registropassageiros",
    resave: true,
    saveUninitialized: true
}))

//app.use(passport.initialize())
//app.use(passport.session())


//handlebars
app.engine('handlebars', handlebars({ 
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
 }))
app.set('view engine', 'handlebars')

//bodyParser

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//ROTAS
const comand = require('./routers/comand');
app.use("/", comand)



//----------EXPRESS CONFIG----------------------------------------------
app.use(express.static('public'));
PORT = process.env.PORT || 7711
app.listen(PORT, () => {
    console.log('servidor conectado! PORTA:', + PORT);
})