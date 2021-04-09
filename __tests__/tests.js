const supertest = require('supertest');
const server = require('../index');
const Url = require('../models/Url');

const request = supertest(server)
describe("/grapql", () => {
  beforeEach(() => {
    jest.setTimeout(8000)
  })

  afterAll(async () => {
    await server.close()
    await Url.deleteMany({})
    jest.clearAllTimers()
  })

  describe("post /", () => {
    test('should fetch shortUrl', async (done) => {
      request
        .post("/graphql")
        .send({
          query: `{shortenURL(longUrl: "https://www.today.ng/technology/internet/google-launches-lyra-codec-beta-reduce-voice-call-bandwidth-usage-357088")}`
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.data).toHaveProperty('shortenURL');
          done();
        });
    })
  })

  describe("post /", () => {
    test('should fail cause url is invalid', async (done) => {
      request
        .post("/graphql")
        .send({
          query: `{shortenURL(longUrl: "https:")}`
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.errors[0].message).toBe('invalid longurl');
          done();
        });
    })
  })

  describe('Get /:code', () => {
    test("should redirect to long Url", async () => {
      const url = new Url({
        longUrl : "https://www.today.ng/technology/internet/google-launches-lyra-codec-beta-reduce-voice-call-bandwidth-usage-357088",
        shortUrl: "http://localhost:3030/DAoZZh2S8",
        urlCode: "DAoZZh2S8"
      })
      await url.save()

      const res = await request.get(`/${url.urlCode}`);
      expect(res.redirect).toBeTruthy()

    })
  })

  describe('Get /:code', () => {
    test("should fail cause urlCode is wrong", async () => {
      const url = new Url({
        longUrl : "https://www.today.ng/technology/internet/google-launches-lyra-codec-beta-reduce-voice-call-bandwidth-usage-357088",
        shortUrl: "http://localhost:3030/DAoZZh2S8",
        urlCode: "DAoZZh2S8"
      })
      await url.save()

      const res = await request.get(`/DAoZZh2S`);
      expect(res.status).toBe(404)

    })
  })
})