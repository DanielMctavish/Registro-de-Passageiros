const mongoose = require('mongoose')

//Mongoose config------------------------------------------
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://admin:Ereinion1@registro-passageiros.y0c96.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("banco de dados conectado");
})

//Models---------------------------------------------------

const modeltrip = mongoose.Schema({
    date: {
        type: String
    },
    nome: {
        type: String
    },
    cargo: {
        type: String
    },
    pass: {
        type: Number
    }
})

const modelPassengers = mongoose.Schema({
    nome: {
        type: String
    },
    email: {
        type: String
    },
    categoria: {
        type: String
    },
    numContrato: {
        type: Number
    },
    obs: {
        type: String
    },
    add: {  
        type: String
    }
})

//documentos/coleções----------------------------------------

const tripulantes = mongoose.model("tripulantes", modeltrip)
const passageiros = mongoose.model("passageiros", modelPassengers)

//-------------------------------------------------------------

