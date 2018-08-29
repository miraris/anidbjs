const anidb = require('../index')
const should = require('should')
const objectDiff = require('objectdiff')
const fs = require('fs')

const toEqualOwnProperties = function toEqualOwnProperties (expected, actual) {
  const diff = objectDiff.diffOwnProperties(expected, actual)
  if (diff.changed !== 'equal') {
    throw new Error(JSON.stringify(diff))
  }
}

describe('AniDb: Anime', function () {
  const client = new anidb('', '')

  let returnFile = ''
  client._request = async _ => {
    return fs.readFileSync(returnFile, { encoding: 'utf8' })
  }

  it('Should fail when providing insufficient arguments', function (done) {
    /* jshint immed: false */
    ;(function () {
      new anidb()
    }.should.throw())
    /* jshint immed: true */
    done()
  })

  it('Anime 01 should give expected result', function (done) {
    returnFile = './test/data/anime_01.xml'
    client
      .getAnime(1)
      .then(anime => {
        const expected = require('./expected/anime_01.js')
        toEqualOwnProperties(anime, expected)
        done()
      })
  })
})
