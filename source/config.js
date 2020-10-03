module.exports = {
    port: process.env.PORT || 3001,
    secret_token: process.env.SECRET_TOKEN,
    db: process.env.MONGODB || 'mongodb+srv://DiegoVelasquez:DiegoVelasquez1@cluster0.8d8gs.mongodb.net/learntic-authentication-db?retryWrites=true&w=majority',
}