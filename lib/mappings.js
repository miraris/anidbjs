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
      ...(ratings.permanent && {
        permanent: {
          score: ratings.permanent._,
          count: ratings.permanent.$.count
        }
      }),
      ...(ratings.temporary && {
        temporary: {
          score: ratings.temporary._,
          count: ratings.temporary.$.count
        }
      }),
      ...(ratings.review && {
        review: {
          score: ratings.review._,
          count: ratings.review.$.count
        }
      })
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
      url: anime.url,
      titles: anime.titles ? anime.titles.title.map(this.mapTitle, this) : [],
      description: anime.description,
      picture: anime.picture,
      ratings: this.mapRatings(anime.ratings),
      tags: anime.tags
        ? utils.ensureArray(anime.tags.tag).map(this.mapTag, this)
        : [],
      episodes: anime.episodes
        ? utils.ensureArray(anime.episodes.episode).map(this.mapEpisode, this)
        : []
    }
  }
}

module.exports = Mapper
