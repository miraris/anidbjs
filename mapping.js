function Mapper() {}

Mapper.prototype.mapGenre = function(category){
    return {
        id: category.$.id,
        name: category.name[0],
        description: category.description ? category.description[0] : '',
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
        name: tag.name[0],
        count: tag.count[0],
        description: tag.description ? tag.description[0] : ''
    };
};

// TODO: Implement mapping for this
Mapper.prototype.mapEpisode = function(episode){
    return {
        id: episode.$.id,
        update: episode.$.update,
        epno: episode.epno[0]._,
        type: episode.epno[0].$.type,
        length: episode.length[0],
        airdate: episode.airdate[0],
        rating: episode.rating ? episode.rating[0]._ : null,
        votes: episode.rating ? episode.rating[0].$.votes : null,
        titles: episode.title.map(this.mapTitle, this)
    };
};

Mapper.prototype.mapAnime = function(anime){
    return {
        id: anime.$.id,
        type: anime.type[0],
        episodecount: anime.episodecount[0],
        startdate: anime.startdate[0],
        enddate: anime.enddate[0],
        titles: anime.titles[0].title.map(this.mapTitle, this),
        description: anime.description[0],
        picture: anime.picture[0],
        categories: anime.categories[0].category.map(this.mapGenre, this),
        tags: anime.tags[0].tag.map(this.mapTag),
        episodes: anime.episodes[0].episode.map(this.mapEpisode, this)
    };
};

module.exports = Mapper;
