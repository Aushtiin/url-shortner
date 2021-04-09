const { buildSchema } = require('graphql');
const Url = require('../models/Url');
const validUrl = require('valid-url');
const baseUrl = process.env.BASEURL;
const shortid = require('shortid')


const schema = buildSchema(`
type Query {
  shortenURL(longUrl: String): String!
}
`)

const root = {
  shortenURL: async ({ longUrl }) => {
    if (!validUrl.isUri(baseUrl)) {
      throw new Error('invalid base url')
    }

    const urlCode = shortid.generate();

    if (validUrl.isHttpsUri(longUrl)) {
      try {
        let url = await Url.findOne({ longUrl });
        if (url) {
          return url.shortUrl
        } else {
          const shortUrl = baseUrl + '/' + urlCode;
          url = new Url({
            longUrl,
            shortUrl,
            urlCode,
           date: new Date()
          });

          await url.save()
          return url.shortUrl
        }
      } catch (error) {
        console.error(error)
        throw new Error('server error')
      }
    } else {
      throw new Error('invalid longurl')
    }
  }
}

module.exports = {
  schema,
  root
}