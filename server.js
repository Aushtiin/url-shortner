const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { connectDB } = require('./config/db');
const Url = require('./models/Url');
const { schema, root } = require('./schema/schema')
const expressPlayground = require("graphql-playground-middleware-express").default
require('dotenv').config()

connectDB();

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl)
    } else {
      return res.status(404).json('no url found')
    }
  } catch (error) {
    console.log(error)
    res.status(500).json('Server error')
  }
})

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

module.exports = app