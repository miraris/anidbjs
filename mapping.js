exports.mapGenre = function(category){
    return {
        id: category.$.id,
        name: category.name[0],
        description: category.description ? category.description[0] : '',
        ishentai: category.$.ishentai,
        parentid: category.$.parentid,
        weight: category.$.weight
    };
};

exports.mapGenres = function(parsed){
    return parsed.category.map(exports.mapGenre);
};

exports.mapTitles = function(title){
    return {
        title: title._,
        language: title.$['xml:lang'],
        type: title.$.type
    };
};

exports.mapTag = function(tag){
    console.log(tag);
    return {
        id: tag.$.id,
        approval: tag.$.approval,
        spoiler: tag.$.spoiler,
        localspoiler: tag.$.localspoiler,
        globalspoiler: tag.$.globalspoiler,
        update: tag.$.update,
        name: tag.name[0],
        count: tag.count[0],
        description: tag.description[0]
    };
};

// TODO: Implement mapping for this
exports.mapEpisode = function(episode){
    console.log(episode);
    return episode;
};

exports.mapAnime = function(anime){
    console.log(anime);
    return {
        id: anime.$.id,
        type: anime.type[0],
        episodecount: anime.episodecount[0],
        startdate: anime.startdate[0],
        enddate: anime.enddate[0],
        titles: anime.titles[0].title.map(exports.mapTitles),
        description: anime.description[0],
        picture: anime.picture[0],
        categories: anime.categories[0].category.map(exports.mapGenre),
        tags: anime.tags[0].tag.map(exports.mapTag),
        episodes: anime.episodes
    };
};
