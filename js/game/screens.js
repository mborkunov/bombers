define('screens',
  ['intro', 'menu', 'arena', 'help', 'credits', 'editor', 'players','score','levels'].map(function(screen) {
    return 'screens/' + screen;
  })
);
