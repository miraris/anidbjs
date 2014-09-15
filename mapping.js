function Mapper() {}

Mapper.prototype.firstOrDefault = function(possibleArray){
    if(typeof possibleArray == 'undefined') return null;
    return possibleArray[0];
};

Mapper.prototype.tryParseInt = function(possibleNumber){
    if(typeof possibleNumber == 'undefined' || possibleNumber == null) return;
    return parseInt(possibleNumber, 10);
};

Mapper.prototype.mapGenre = function(category){
    return {
        id: category.$.id,
        name: this.firstOrDefault(category.name),
        description: this.firstOrDefault(category.description),
        ishentai: category.$.ishentai,
        parentid: category.$.parentid,
        weight: category.$.weight
    };
};

Mapper.prototype.mapGenres = function(parsed){
    return parsed.category.map(this.mapGenre, this);
};

Mapper.prototype.mapTitle = function(title){
    return {
        title: title._,
        language: title.$['xml:lang'],
        type: title.$.type
    };
};

Mapper.prototype.mapTag = function(tag){
    return {
        id: tag.$.id,
        approval: tag.$.approval,
        spoiler: tag.$.spoiler,
        localspoiler: tag.$.localspoiler,
        globalspoiler: tag.$.globalspoiler,
        update: tag.$.update,
        name: this.firstOrDefault(tag.name),
        count: this.tryParseInt(this.firstOrDefault(tag.count)),
        description: this.firstOrDefault(tag.description)
    };
};

// TODO: Implement mapping for this
Mapper.prototype.mapEpisode = function(episode){
    return {
        id: this.tryParseInt(episode.$.id),
        update: episode.$.update,
        epno: this.tryParseInt(episode.epno[0]._),
        type: this.tryParseInt(episode.epno[0].$.type),
        length: this.tryParseInt(this.firstOrDefault(episode.length)),
        airdate: this.firstOrDefault(episode.airdate),
        rating: this.firstOrDefault(episode.rating),
        votes: episode.rating ? episode.rating[0].$.votes : null,
        titles: episode.title ? episode.title.map(this.mapTitle, this) : null
    };
};

Mapper.prototype.mapAnime = function(anime){
    return {
        id: anime.$.id,
        type: this.firstOrDefault(anime.type),
        episodecount: this.tryParseInt(this.firstOrDefault(anime.episodecount)),
        startdate: this.firstOrDefault(anime.startdate),
        enddate: this.firstOrDefault(anime.enddate),
        titles: anime.titles ? anime.titles[0].title.map(this.mapTitle, this) : null,
        description: this.firstOrDefault(anime.description),
        picture: this.firstOrDefault(anime.picture),
        categories: anime.categories[0].category.map(this.mapGenre, this),
        tags: anime.tags[0].tag.map(this.mapTag, this),
        episodes: anime.episodes[0].episode.map(this.mapEpisode, this)
    };
};

module.exports = Mapper;
