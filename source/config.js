module.exports = {
    port: process.env.PORT || 3001,
    secret_token: process.env.SECRET_TOKEN || '104179G104183A104207T104231H104233E104239R104243M104281E104287AUTH104297',
    db: process.env.MONGODB || 'mongodb+srv://DiegoVelasquez:DiegoVelasquez1@cluster0.8d8gs.mongodb.net/learntic-autentication-db?retryWrites=true&w=majority',
}