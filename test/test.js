/* eslint-disable */
const should = require("should");
const { deepEqual } = require("assert-diff");
const fs = require("fs");
const AniDb = require("../lib/anidb");

describe("AniDb: Anime", (_) => {
  const client = new AniDb({ client: "anidbjs", version: 2 });

  let returnFile = "";
  client.request = async (_) =>
    fs.readFileSync(returnFile, { encoding: "utf8" });

  it("Should fail when providing insufficient arguments", () => {
    ((_) => {
      new AniDb();
    }).should.throw();
  });

  it("Random recommendation should give expected result", () => {
    returnFile = "./test/data/randomRecommendation.xml";

    return client.randomRecommendation().then((anime) => {
      const expected = require("./expected/randomRecommendation.js");
      deepEqual(expected, anime);
    });
  });

  it("Anime 01 should give expected result", () => {
    returnFile = "./test/data/anime_01.xml";

    return client.anime(1).then((anime) => {
      const expected = require("./expected/anime_01.js");
      deepEqual(expected, anime);
    });
  });

  it.skip("Anime 2322 should give expected result", () => {
    returnFile = "./test/data/anime_2322.xml";

    return client.anime(2322).then((anime) => {
      const expected = require("./expected/anime_2322.js");
      deepEqual(expected, anime);
    });
  });

  it("Anime 11021 should give expected result", () => {
    returnFile = "./test/data/anime_11021.xml";

    return client.anime(11021).then((anime) => {
      const expected = require("./expected/anime_11021.js");
      deepEqual(expected, anime);
    });
  });

  it.skip("Anime 357 real request should return a successfull response", () => {
    // yoink
    const realClient = new AniDb(
      { client: "alastorehttp", version: 1 },
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
        },
      }
    );

    // realClient.proxy = 'http://110.232.83.115:8080'

    return realClient.anime(357).then((anime) => {
      const expected = require("./expected/anime_357.js");
      deepEqual(expected, anime);
    });
  }).timeout(10000);
});
