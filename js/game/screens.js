define('screens',
  ['intro', 'menu', 'arena', 'help', 'credits', 'editor', 'players','score'].map(function(screen) {
    return 'screens/' + screen;
  })
);
