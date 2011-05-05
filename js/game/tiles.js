define('tiles',
  ['tile', 'ground', 'box', 'arrow', 'ice',
   'none', 'trap', 'wall', 'map'].map(function(tile) {return 'tiles/' + tile})
);