const _ = require('lodash')

function Mapper () {}

Mapper.prototype.tryParseInt = function (possibleNumber) {
  if (typeof possibleNumber === 'undefined' || possibleNumber == null) return
  return parseInt(possibleNumber, 10)
}

Mapper.prototype.tryParseFloat = function (possibleNumber) {
  if (typeof possibleNumber === 'undefined' || possibleNumber == null) return
  return parseFloat(possibleNumber, 10)
}

Mapper.prototype.tryParseBool = function (possibleBool) {
  if (typeof possibleBool === 'undefined' || possibleBool == null) return
  if (possibleBool === 'true') return true
  if (possibleBool === 'false') return false
}

Mapper.prototype.makeArray = function (possibleArray) {
  return _.isArray(possibleArray) ? possibleArray : [possibleArray]
}

Mapper.prototype.mapAnimeCategory = function (category) {
  return {
    id: this.tryParseInt(category.$.id),
    name: category.name,
    description: category.description,
    ishentai: this.tryParseBool(category.$.hentai),
    parentid: this.tryParseInt(category.$.parentid),
    weight: this.tryParseInt(category.$.weight)
  }
}

Mapper.prototype.mapGenre = function (category) {
  return {
    id: this.tryParseInt(category.$.id),
    name: category.name,
    description: category.description,
    ishentai: this.tryParseBool(category.$.ishentai),
    parentid: this.tryParseInt(category.$.parentid)
  }
}

Mapper.prototype.mapGenres = function (parsed) {
  return this.makeArray(parsed.category).map(this.mapGenre, this)
}

Mapper.prototype.mapTitle = function (title) {
  return {
    title: title._,
    language: title.$['xml:lang'],
    ...(title.$.type && { type: title.$.type })
  }
}

Mapper.prototype.mapTag = function (tag) {
  return {
    id: this.tryParseInt(tag.$.id),
    approval: tag.$.approval,
    spoiler: this.tryParseBool(tag.$.spoiler),
    localspoiler: this.tryParseBool(tag.$.localspoiler),
    globalspoiler: this.tryParseBool(tag.$.globalspoiler),
    update: tag.$.update,
    name: tag.name,
    count: this.tryParseInt(tag.count),
    description: tag.description
  }
}

// TODO: Implement mapping for this
Mapper.prototype.mapEpisode = function (episode) {
  return {
    id: this.tryParseInt(episode.$.id),
    update: episode.$.update,
    epno: episode.epno._, // this doesn't have to be a number
    type: this.tryParseInt(episode.epno.$.type),
    length: this.tryParseInt(episode.length),
    airdate: episode.airdate,
    rating: episode.rating ? this.tryParseFloat(episode.rating._) : null,
    votes: episode.rating ? this.tryParseInt(episode.rating.$.votes) : null,
    titles: episode.title
      ? this.makeArray(episode.title).map(this.mapTitle, this)
      : []
  }
}

Mapper.prototype.mapAnime = function (anime) {
  return {
    id: this.tryParseInt(anime.$.id),
    type: anime.type,
    episodecount: this.tryParseInt(anime.episodecount),
    startdate: anime.startdate,
    enddate: anime.enddate,
    titles: anime.titles ? anime.titles.title.map(this.mapTitle, this) : [],
    description: anime.description,
    picture: anime.picture,
    categories: anime.categories
      ? this.makeArray(anime.categories.category).map(
        this.mapAnimeCategory,
        this
      )
      : [],
    tags: anime.tags
      ? this.makeArray(anime.tags.tag).map(this.mapTag, this)
      : [],
    episodes: anime.episodes
      ? this.makeArray(anime.episodes.episode).map(this.mapEpisode, this)
      : []
  }
}

module.exports = Mapper
