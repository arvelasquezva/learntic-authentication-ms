'use strict'

const mongoose = require('mongoose')
const app = require('./source/app')
const config = require('./source/config')


mongoose.connect(config.db, (err, res) => {
    if (err) {
        return console.log(`error al conectar a la base de datos:${err}`)
    }
    console.log('conexion establecida con la base de datos')

    app.listen(config.port, () => {
        console.log(`Micro Servicio Corriendo en http://localhost:${config.port}`)
    })
})