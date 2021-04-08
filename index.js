const app = require('./server')

const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode, and listening on Port ${PORT}`)
});