const axios = require('axios')
const xml2js = require('xml2js')
const Mapper = require('./mapping')
const util = require('util')

class AniDB {
  constructor (client, version) {
    if (client === undefined || version === undefined) {
      throw new Error('A client string and a version number have to be passed to the AniDB constructor.')
    }

    this.client = client
    this.version = version
    this.mapper = new Mapper()
  }

  /**
   * The request function
   * @param {object} opts
   */
  async _request (opts) {
    const url = 'http://api.anidb.net:9001/httpapi'
    const errors = [
      '<error>Banned</error>',
      '<error code="500">banned</error>',
      '<error>Anime not found</error>',
      '<error code="302">client version missing or invalid</error>',
      '<error>Client Values Missing or Invalid</error>',
      '<error>aid Missing or Invalid</error>'
    ]

    try {
      const res = await axios({
        url,
        params: {
          client: this.client,
          clientver: this.version,
          protover: 1,
          ...opts
        }
      })

      if (res.status < 200 || res.status > 299) {
        throw new Error(`Endpoint returned a ${res.status} status code`)
      } else if (errors.includes(res.data)) {
        throw new Error(`AniDB returned an error => ${res.data}`)
      }

      return res.data
    } catch (err) {
      throw err
    }
  }

  /**
   * Get an anime
   * @param {Number} id
   */
  async getAnime (id) {
    const opts = {
      request: 'anime',
      aid: id
    }

    try {
      const res = await this._request(opts)
      const parseString = util.promisify(xml2js.parseString)

      return this.mapper.mapAnime(
        await parseString(res, { explicitRoot: false, explicitArray: false })
      )
    } catch (err) {
      throw err
    }
  }
}

module.exports = AniDB
