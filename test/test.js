var anidb = require('../index')

var should = require('should')

var objectDiff = require('objectdiff')

var fs = require('fs')
/**
 * Created by groenlid on 19/11/14.
 */

var toEqualOwnProperties = function toEqualOwnProperties (expected, actual) {
  var diff = objectDiff.diffOwnProperties(expected, actual)
  if (diff.changed !== 'equal') {
    throw new Error(JSON.stringify(diff))
  }
  // throw new Error(objectDiff.convertToXMLString(diff));
}

describe('AniDb: Anime', function () {
  var client = new anidb('', '')

  var returnFile = ''
  client._doRequest = function (options, callback) {
    var body = fs.readFileSync(returnFile, { encoding: 'utf8' })
    return callback(null, { statusCode: 200 }, body)
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
        var expected = require('./expected/anime_01.js')
        toEqualOwnProperties(anime, expected)
        done()
      })
      .catch(error => console.error(error))
  })

  it('Genres should give expected result', function (done) {
    returnFile = './test/data/categories.xml'
    client.getGenres(function (err, categories) {
      var expected = require('./expected/categories.js')
      toEqualOwnProperties(categories, expected)
      done()
    })
  })
})
