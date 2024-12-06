const CACHE_NAME = 'phaser-game-cache-v1';
const assetsToCache = [
    '/index.html',
    '/src/main.js', 

    '/assets/spritesheets/player.png',
    '/assets/spritesheets/plant.png',
    '/assets/spritesheets/inventory.png',

    '/assets/map.json',

    '/assets/tilesets/Decor.png',
    '/assets/tilesets/FarmTiles.png',
    '/assets/tilesets/Grass.png',
    '/assets/tilesets/Fences.png',
    '/assets/tilesets/PauseButton.png',
    '/assets/tilesets/Save.png',
    '/assets/tilesets/RedoButton.png',
    '/assets/tilesets/UndoButton.png',
    '/assets/tilesets/RestartButton.png',
    '/assets/tilesets/TiledGround.png',
    '/assets/tilesets/Tree.png',
    '/assets/tilesets/Water.png',
  
    '/src/prefabs/Plant.js',
    'src/prefabs/Player.js',
    '/src/prefabs/PlantGrid.js',
    'src/prefabs/Inventory.js', 

    '/src/scenes/Game.js',
    'src/scenes/Load.js',

    '/lib/phaser.js',  
];

// Install event: cache the assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event: serve cached assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
