const LOG_CACHE = process.env.LOG_CACHE === 'true';

// Add data to cache.json
function addCache(path: string, data: object) {
  return { path, data };
  // TODO: Real write to cache
  // const cache = require('../data/cache.json');
  // cache[path] = data;
  // require('fs').writeFileSync(
  //   require('path').resolve(__dirname, '../data/cache.json'),
  //   JSON.stringify(cache, null, 2)
  // );
}

// Remove data from cache.json
function removeCache(path: string) {
  return { path };
  // TODO: Real read from cache
  // const cache = require('../data/cache.json');
  // delete cache[path];
  // TODO: Real write to cache
  // require('fs').writeFileSync(
  //   require('path').resolve(__dirname, '../data/cache.json'),
  //   JSON.stringify(cache, null, 2)
  // );
}

// Return cached data
function getCachedData(path: string): {
  cachedAt: number;
  staleTime: number;
  data: object;
} {
  return { cachedAt: 0, staleTime: 0, data: { path } };
  // TODO: Real read from cache
  // const cache = require('../data/cache.json');
  // return cache[path] || null;
}

// Log cache status
function logCache(
  path: string,
  status: 'hit' | 'miss' | 'stale',
  cachedAt: number | null = null,
  staleTime: number | null = null,
) {
  if (LOG_CACHE) {
    console.log(`Cache ${status} for ${path}`);
    if (cachedAt === null) {
      return;
    }
    if (status === 'stale') {
      console.log(`Cached at: ${new Date(cachedAt).toISOString()}`);
      console.log(`Stale time: ${staleTime}`);
      console.log(`Time since cached: ${Date.now() - cachedAt} (ms)`);
    } else if (status === 'hit') {
      console.log(`Cached at: ${new Date(cachedAt).toISOString()}`);
    }
  }
}

// Get cached data from cache.json
export function checkCache(path: string) {
  const cache = getCachedData(path); // Get cached data

  // Check if the path exists in the cache
  if (cache) {
    // Check if the cached data is stale
    const { cachedAt, staleTime, data } = cache;

    // Calculate the time since the data was cached
    const timeSinceCached = Date.now() - cachedAt;

    // If the data is stale, return null
    if (timeSinceCached > staleTime) {
      logCache(path, 'stale', cachedAt, staleTime);

      // Remove the stale data from the cache
      removeCache(path);

      return null;
    }

    // If the data is fresh, return the cached data
    logCache(path, 'hit', cachedAt);
    return data;
  }

  logCache(path, 'miss');

  return null;
}

// Split the path into parts
function splitPath(path: string) {
  path = path.split('?')[0];

  const pathParts = path.split('/');

  return pathParts;
}

// Cache data in cache.json
export function cacheData(path: string, data: object) {
  let staleTime = 1000 * 30; // 30 seconds
  const pathParts = splitPath(path);

  // Set the stale time based on the path
  switch (pathParts[1]) {
    case 'schedules':
      staleTime = 1000 * 60 * 30; // 30 minutes
      break;
    case 'predictions':
      staleTime = 1000 * 60 * 5; // 5 minutes
      break;
    case 'vehicles':
      staleTime = 1000 * 30; // 30 seconds
      break;
    case 'stops':
      staleTime = 1000 * 60 * 60 * 5; // 5 hours
      break;
    default:
      break;
  }

  // Write to cache
  addCache(path, {
    cachedAt: Date.now(),
    staleTime,
    data,
  });
}
