const utils = require('./utils')

class Mapper {
  mapTitle (title) {
    return {
      title: title._,
      language: title.$['xml:lang'],
      ...(title.$.type && { type: title.$.type })
    }
  }

  mapTag (tag) {
    return {
      id: utils.tryParseInt(tag.$.id),
      parentId: utils.tryParseInt(tag.$.parentid),
      weight: utils.tryParseInt(tag.$.weight),
      localSpoiler: utils.tryParseBool(tag.$.localspoiler),
      globalSpoiler: utils.tryParseBool(tag.$.globalspoiler),
      name: tag.name,
      description: tag.description,
      pictureUrl: tag.picurl,
      updatedAt: tag.$.update
    }
  }

  mapEpisode (episode) {
    return {
      id: utils.tryParseInt(episode.$.id),
      updatedAt: episode.$.update,
      episodeNumber: episode.epno._, // this doesn't have to be a number
      type: utils.tryParseInt(episode.epno.$.type),
      length: utils.tryParseInt(episode.length),
      airDate: episode.airdate,
      rating: episode.rating ? utils.tryParseFloat(episode.rating._) : null,
      votes: episode.rating ? utils.tryParseInt(episode.rating.$.votes) : null,
      titles: episode.title
        ? utils.ensureArray(episode.title).map(this.mapTitle, this)
        : []
    }
  }

  mapRatings (ratings) {
    return {
      permanent: {
        score: ratings.permanent && ratings.permanent._,
        count: ratings.permanent && ratings.permanent.$.count
      },
      temporary: {
        score: ratings.temporary && ratings.temporary._,
        count: ratings.temporary && ratings.temporary.$.count
      },
      review: {
        score: ratings.review && ratings.review._,
        count: ratings.review && ratings.review.$.count
      }
    }
  }

  mapCharacterType (type) {
    return {
      id: utils.tryParseInt(type.$.id),
      name: type._
    }
  }

  mapSeiyuu (seiyuu) {
    return {
      id: utils.tryParseInt(seiyuu.$.id),
      picture: seiyuu.$.picture,
      name: seiyuu._
    }
  }

  mapRecommendations (recommendation) {
    return {
      type: recommendation.$.type,
      uid: utils.tryParseInt(recommendation.$.uid),
      content: recommendation._
    }
  }

  mapCharacters (character) {
    return {
      id: utils.tryParseInt(character.$.id),
      type: character.$.type,
      updatedAt: character.$.update,
      rating: character.rating ? utils.tryParseFloat(character.rating._) : null,
      votes: character.rating
        ? utils.tryParseInt(character.rating.$.votes)
        : null,
      name: character.name,
      gender: character.gender,
      characterType:
        character.charactertype &&
        this.mapCharacterType(character.charactertype),
      description: character.description,
      picture: character.picture,
      seiyuu: character.seiyuu && this.mapSeiyuu(character.seiyuu)
    }
  }

  mapCreators (creator) {
    return {
      id: utils.tryParseInt(creator.$.id),
      type: creator.$.type,
      name: creator._
    }
  }

  mapAnime (anime) {
    return {
      id: utils.tryParseInt(anime.$.id),
      ageRestricted: utils.tryParseBool(anime.$.restricted),
      type: anime.type,
      episodeCount: utils.tryParseInt(anime.episodecount),
      startDate: anime.startdate,
      endDate: anime.enddate,
      titles: anime.titles
        ? utils.ensureArray(anime.titles.title).map(this.mapTitle, this)
        : [],
      description: anime.description,
      picture: anime.picture,
      ratings: anime.ratings && this.mapRatings(anime.ratings),
      recommendations: anime.recommendations
        ? utils
          .ensureArray(anime.recommendations.recommendation)
          .map(this.mapRecommendations, this)
        : [],
      url: anime.url,
      creators: anime.creators
        ? utils.ensureArray(anime.creators.name).map(this.mapCreators, this)
        : [],
      tags: anime.tags
        ? utils.ensureArray(anime.tags.tag).map(this.mapTag, this)
        : [],
      characters: anime.characters
        ? utils
          .ensureArray(anime.characters.character)
          .map(this.mapCharacters, this)
        : [],
      episodes: anime.episodes
        ? utils.ensureArray(anime.episodes.episode).map(this.mapEpisode, this)
        : []
    }
  }
}

module.exports = Mapper
