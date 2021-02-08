const utils = require("./utils");

class Mapper {
  static mapTitle(title) {
    return {
      title: title._,
      language: title.$["xml:lang"],
      ...(title.$.type && { type: title.$.type }),
    };
  }

  static mapTag(tag) {
    return {
      id: utils.tryParseInt(tag.$.id),
      parentId: utils.tryParseInt(tag.$.parentid),
      weight: utils.tryParseInt(tag.$.weight),
      localSpoiler: utils.tryParseBool(tag.$.localspoiler),
      globalSpoiler: utils.tryParseBool(tag.$.globalspoiler),
      name: tag.name,
      description: tag.description,
      pictureUrl: tag.picurl,
      updatedAt: tag.$.update,
    };
  }

  static mapRatings(ratings) {
    return {
      permanent: {
        score: ratings.permanent && ratings.permanent._,
        count: ratings.permanent && ratings.permanent.$.count,
      },
      temporary: {
        score: ratings.temporary && ratings.temporary._,
        count: ratings.temporary && ratings.temporary.$.count,
      },
      review: {
        score: ratings.review && ratings.review._,
        count: ratings.review && ratings.review.$.count,
      },
    };
  }

  static mapCharacterType(type) {
    return {
      id: utils.tryParseInt(type.$.id),
      name: type._,
    };
  }

  static mapSeiyuu(seiyuu) {
    return {
      id: utils.tryParseInt(seiyuu.$.id),
      picture: seiyuu.$.picture,
      name: seiyuu._,
    };
  }

  static mapRecommendations(recommendation) {
    // console.log(recommendation)
    return {
      type: recommendation.$.type,
      uid: utils.tryParseInt(recommendation.$.uid),
      content: recommendation._,
    };
  }

  static mapRelated(related) {
    return {
      id: utils.tryParseInt(related.$.id),
      type: related.$.type,
      name: related._,
    };
  }

  static mapSimilar(similar) {
    return {
      id: utils.tryParseInt(similar.$.id),
      approval: utils.tryParseInt(similar.$.approval),
      total: utils.tryParseInt(similar.$.total),
      name: similar._,
    };
  }

  static mapCreators(creator) {
    return {
      id: utils.tryParseInt(creator.$.id),
      type: creator.$.type,
      name: creator._,
    };
  }

  static mapExternalEntities(externalEntity) {
    return {
      ids:
        externalEntity.identifier &&
        utils.ensureArray(externalEntity.identifier),
      url: externalEntity.url,
    };
  }

  static mapEpisode(episode) {
    return {
      id: utils.tryParseInt(episode.$.id),
      updatedAt: episode.$.update,
      episodeNumber: episode.epno._,
      type: utils.tryParseInt(episode.epno.$.type),
      length: utils.tryParseInt(episode.length),
      airDate: episode.airdate,
      rating: episode.rating ? utils.tryParseFloat(episode.rating._) : null,
      votes: episode.rating ? utils.tryParseInt(episode.rating.$.votes) : null,
      titles: episode.title
        ? utils.ensureArray(episode.title).map(Mapper.mapTitle)
        : [],
      summary: episode.summary || null,
    };
  }

  static mapCharacters(character) {
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
        Mapper.mapCharacterType(character.charactertype),
      description: character.description,
      picture: character.picture,
      seiyuu: character.seiyuu
        ? utils.ensureArray(character.seiyuu).map(Mapper.mapSeiyuu)
        : [],
    };
  }

  static mapResources(resource) {
    return {
      type: utils.tryParseInt(resource.$.type),
      externalEntity: resource.externalentity
        ? utils
            .ensureArray(resource.externalentity)
            .map(Mapper.mapExternalEntities)
        : [],
    };
  }

  static mapAnime(anime) {
    return {
      id: utils.tryParseInt(anime.$.id),
      ageRestricted: utils.tryParseBool(anime.$.restricted),
      type: anime.type,
      episodeCount: utils.tryParseInt(anime.episodecount),
      startDate: anime.startdate,
      endDate: anime.enddate,
      titles: utils.mapArray(anime.titles, "title", Mapper.mapTitle),
      description: anime.description,
      picture: anime.picture,
      ratings: anime.ratings && Mapper.mapRatings(anime.ratings),
      related: utils.mapArray(anime.relatedanime, "anime", Mapper.mapRelated),
      similar: utils.mapArray(anime.similaranime, "anime", Mapper.mapSimilar),
      recommendations: utils.mapArray(
        anime.recommendations,
        "recommendation",
        Mapper.mapRecommendations
      ),
      url: anime.url,
      creators: utils.mapArray(anime.creators, "name", Mapper.mapCreators),
      resources: utils.mapArray(
        anime.resources,
        "resource",
        Mapper.mapResources
      ),
      tags: utils.mapArray(anime.tags, "tag", Mapper.mapTag),
      characters: utils.mapArray(
        anime.characters,
        "character",
        Mapper.mapCharacters
      ),
      episodes: utils.mapArray(anime.episodes, "episode", Mapper.mapEpisode),
    };
  }
}

module.exports = Mapper;
