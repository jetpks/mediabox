(function () {
  "use strict";
  
  require('remedial');

  var fs = require('fs')
    , path = require('path')
    , pathnames = {}
    , lines = fs.readFileSync('db-all-unique.txt').toString().split('\n')
    , files = {}
    , M_MD5SUM = 1
    , M_PATHNAME = 2
    , TITLES = 0
    , TAGS = 1
    , TIMES = 2;

  function transform(line) {
    var m = line.match(/([a-z0-9]{32}) - (.*)/)
      , pathname
      , md5sum
      , title
      , tags
      , file;

    if (!m) {
      console.log('All Done');
      return;
    }

    md5sum = m[M_MD5SUM];    
    tags = path.dirname(m[M_PATHNAME]).split('/');
    // only saving the last 3 paths because, at least in AJ's library, 
    // none of the directories above this are useful for identification
    while (tags.length > 3) {
      tags.shift();
    }
    tags = tags.join('/');
    pathnames[tags] = true;
    title = path.basename(m[M_PATHNAME]);

    file = files[md5sum] || [ [], [] ];
    files[md5sum] = file;

    // file[TIMES].push(time);
    if (-1 === file[TAGS].indexOf(tags)) {
      file[TAGS].push(tags); // = file[TAGS].concat(tags);
    }
    if (-1 === file[TITLES].indexOf(title)) {
      file[TITLES].push(title)
    }
  }

  lines.forEach(transform);
  fs.writeFileSync('./db-all-unique.json', JSON.stringify(files, null, '  '));

  // just to see that nothing looks like it would be useful above the third path
  // It seems that typical libraries are organized thusly:
  //
  // typically LibraryApp/Artist/Album/Song.mime
  // or Playlists/Category/Song.mime
  //
  // Rarely would they be organized thusly:
  // tag/tag/tag/song.mime
  console.log(Object.keys(pathnames).sort());
}());
