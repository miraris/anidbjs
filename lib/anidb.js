const got = require("got");
const { parseStringPromise: parseString } = require("xml2js");
const HttpError = require("./errors/httpError");
const Mapper = require("./mappings");

class AniDB {
  /**
   * Creates a new AniDB client instance
   *
   * @param {Object} credentials - AniDB HTTP API credentials
   * @param {string} credentials.client - The client string
   * @param {string} credentials.version - The version number
   * @param {Object} options - Library specific options, such as timeout and proxy
   * @param {string} options.baseUrl - AniDB HTTP API base URL
   * @param {string} options.timeout - Request timeout in milliseconds
   * @param {string} options.agent - An HTTP(s) agent
   * @param {Object} options.headers - Additional HTTP headers
   */
  constructor(credentials, options) {
    if (credentials.client === undefined || credentials.version === undefined) {
      throw new Error(
        "A client string and a version number have to be passed to the AniDB constructor."
      );
    }

    const defaultOptions = {
      prefixUrl: "http://api.anidb.net:9001/httpapi",
      timeout: 5000,
      headers: {
        "user-agent": "anidbjs/2.4.0",
      },
    };
    this.opts = got.mergeOptions(got.defaults.options, {
      ...defaultOptions,
      ...options,
    });
    this.queryParams = {
      client: credentials.client,
      clientver: credentials.version,
      protover: 1,
    };
  }

  /**
   * Set new opts
   *
   * @param {object} proxy Got options object
   */
  set options(opts) {
    this.opts = got.mergeOptions(this.options, opts);
  }

  /**
   * The request function, sends a GET request to AniDB
   * @param {object} params - URL query parameters
   * @returns {object} XML response string
   */
  async request(params) {
    const errors = {
      302: '<error code="302">client version missing or invalid</error>',
      310: '<error code="310">illegal input or access denied</error>',
      500: '<error code="500">banned</error>',
      404: "<error>Anime not found</error>",
      998: "<error>aid Missing or Invalid</error>",
    };
    const res = await got(
      "",
      got.mergeOptions(this.opts, {
        searchParams: {
          ...this.queryParams,
          ...params,
        },
      })
    );
    for (const e in errors) {
      if (res.body.includes(errors[e])) {
        throw new HttpError(`AniDB returned an error. Code ${e}`, e);
      }
    }
    return res.body;
  }

  /**
   * Get an anime by ID
   *
   * @param {number} id The anime ID
   */
  async anime(id) {
    const params = {
      request: "anime",
      aid: id,
    };
    return Mapper.mapAnime(
      await parseString(await this.request(params), {
        explicitRoot: false,
        explicitArray: false,
      })
    );
  }

  /**
   * Random recommendation request, returns 10 random anime
   */
  async randomRecommendation() {
    const params = {
      request: "randomrecommendation",
    };
    return (
      await parseString(await this.request(params), {
        explicitRoot: false,
        explicitArray: false,
      })
    ).recommendation.map((val) => Mapper.mapAnime(val.anime));
  }
}

module.exports = AniDB;
