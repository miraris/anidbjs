/* eslint no-underscore-dangle: 0 */
const util = require('util');
const parseString = util.promisify(require('xml2js').parseString);
const rp = require('request-promise');
const decompressResponse = require('decompress-response');
const HttpError = require('./errors/httpError');
const Mapper = require('./mappings');

class AniDB {
  /**
   * Creates a new AniDB client instance
   *
   * @param {Object} credentials - AniDB HTTP API credentials
   * @param {string} credentials.client - The client string
   * @param {string} credentials.version - The version number
   * @param {Object} options - Library specific options, such as timeout and proxy
   * @param {string} options.url - AniDB HTTP API base URL
   * @param {string} options.timeout - Request timeout in milliseconds
   * @param {string} options.proxy - Proxy server address string
   * @param {Object} options.headers - Additional HTTP headers
   */
  constructor(credentials, options) {
    if (credentials.client === undefined || credentials.version === undefined) {
      throw new Error(
        'A client string and a version number have to be passed to the AniDB constructor.',
      );
    }

    const defaultOptions = {
      url: 'http://api.anidb.net:9001/httpapi',
      timeout: 5 * 1000,
      proxy: undefined,
      headers: {
        'User-Agent': 'anidbjs/2.2.2',
      },
    };
    const fullOptions = { ...defaultOptions, ...options };

    this.proxy = fullOptions.proxy;
    this.apiRequest = rp.defaults({
      method: 'GET',
      baseUrl: fullOptions.url,
      timeout: fullOptions.timeout,
      headers: fullOptions.headers,
      gzip: true,
      resolveWithFullResponse: true,
    });
    this.requestParams = {
      client: credentials.client,
      clientver: credentials.version,
      protover: 1,
    };
    this.mapper = new Mapper();
  }

  /**
   * Return the current axios default proxy
   */
  get proxy() {
    return this._proxy;
  }

  /**
   * Set a global axios default proxy
   *
   * @param {object} proxy The proxy object
   */
  set proxy(proxy) {
    this._proxy = proxy;
  }

  /**
   * The request function, sends a GET request to AniDB
   * @param {object} params - URL query parameters
   * @returns {object} XML response string
   */
  async request(params) {
    const errors = {
      500: '<error code="500">banned</error>',
      404: '<error>Anime not found</error>',
      302: '<error code="302">client version missing or invalid</error>',
      998: '<error>aid Missing or Invalid</error>',
    };

    try {
      const res = decompressResponse(
        await this.apiRequest({
          uri: '',
          qs: {
            ...this.requestParams,
            ...params,
          },
          proxy: this.proxy,
        }),
      );

      Object.entries(errors).forEach(([code, value]) => {
        if (res.body.match(value)) {
          throw new HttpError('AniDB returned an error.', code);
        }
      });

      return res.body;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get an anime by ID
   *
   * @param {number} id The anime ID
   */
  async anime(id) {
    const params = {
      request: 'anime',
      aid: id,
    };

    try {
      return this.mapper.mapAnime(
        await parseString(await this.request(params), {
          explicitRoot: false,
          explicitArray: false,
        }),
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * Random recommendation request, returns 10 random anime
   */
  async randomRecommendation() {
    const params = {
      request: 'randomrecommendation',
    };

    try {
      return (await parseString(await this.request(params), {
        explicitRoot: false,
        explicitArray: false,
      })).recommendation.map(val => this.mapper.mapAnime(val.anime));
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AniDB;
