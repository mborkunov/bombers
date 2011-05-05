define('controllers',
  ['controller', 'mouse', 'keyboard', 'ai']
    .map(function(controller) {return 'controllers/' + controller})
);