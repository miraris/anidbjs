const utils = require('./utils');

class Mapper {
  static mapTitle(title) {
    return {
      title: title._,
      language: title.$['xml:lang'],
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

  static mapCreators(creator) {
    return {
      id: utils.tryParseInt(creator.$.id),
      type: creator.$.type,
      name: creator._,
    };
  }

  static mapExternalEntities(externalEntity) {
    return {
      ids: externalEntity.identifier && utils.ensureArray(externalEntity.identifier),
      url: externalEntity.url,
    };
  }

  mapEpisode(episode) {
    return {
      id: utils.tryParseInt(episode.$.id),
      updatedAt: episode.$.update,
      episodeNumber: episode.epno._,
      type: utils.tryParseInt(episode.epno.$.type),
      length: utils.tryParseInt(episode.length),
      airDate: episode.airdate,
      rating: episode.rating ? utils.tryParseFloat(episode.rating._) : null,
      votes: episode.rating ? utils.tryParseInt(episode.rating.$.votes) : null,
      titles: episode.title ? utils.ensureArray(episode.title).map(Mapper.mapTitle, this) : [],
    };
  }

  mapCharacters(character) {
    return {
      id: utils.tryParseInt(character.$.id),
      type: character.$.type,
      updatedAt: character.$.update,
      rating: character.rating ? utils.tryParseFloat(character.rating._) : null,
      votes: character.rating ? utils.tryParseInt(character.rating.$.votes) : null,
      name: character.name,
      gender: character.gender,
      characterType: character.charactertype && Mapper.mapCharacterType(character.charactertype),
      description: character.description,
      picture: character.picture,
      seiyuu: character.seiyuu
        ? utils.ensureArray(character.seiyuu).map(Mapper.mapSeiyuu, this)
        : [],
    };
  }

  mapResources(resource) {
    return {
      type: utils.tryParseInt(resource.$.type),
      externalEntity: resource.externalentity
        ? utils.ensureArray(resource.externalentity).map(Mapper.mapExternalEntities, this)
        : [],
    };
  }

  mapAnime(anime) {
    return {
      id: utils.tryParseInt(anime.$.id),
      ageRestricted: utils.tryParseBool(anime.$.restricted),
      type: anime.type,
      episodeCount: utils.tryParseInt(anime.episodecount),
      startDate: anime.startdate,
      endDate: anime.enddate,
      titles: utils.isValid(anime.titles)
        ? utils.ensureArray(anime.titles.title).map(Mapper.mapTitle, this)
        : [],
      description: anime.description,
      picture: anime.picture,
      ratings: anime.ratings && Mapper.mapRatings(anime.ratings),
      recommendations: utils.isValid(anime.recommendations)
        ? utils
          .ensureArray(anime.recommendations.recommendation)
          .map(Mapper.mapRecommendations, this)
        : [],
      url: anime.url,
      creators: utils.isValid(anime.creators)
        ? utils.ensureArray(anime.creators.name).map(Mapper.mapCreators, this)
        : [],
      resources: utils.isValid(anime.resources)
        ? utils.ensureArray(anime.resources.resource).map(this.mapResources, this)
        : [],
      tags: utils.isValid(anime.tags)
        ? utils.ensureArray(anime.tags.tag).map(Mapper.mapTag, this)
        : [],
      characters: utils.isValid(anime.characters)
        ? utils.ensureArray(anime.characters.character).map(this.mapCharacters, this)
        : [],
      episodes: utils.isValid(anime.episodes)
        ? utils.ensureArray(anime.episodes.episode).map(this.mapEpisode, this)
        : [],
    };
  }
}

module.exports = Mapper;
