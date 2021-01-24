export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb+srv://cleanapi:cleanapi@cluster0.ab3ep.mongodb.net/<dbname>?authSource=admin&replicaSet=atlas-ndjf8d-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
  port: process.env.PORT || 5050,
  secret: process.env.SECRET || 'secret'
}
