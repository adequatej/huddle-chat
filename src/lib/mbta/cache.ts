import client from '../db';
import { MBTACache } from '../types/mbta';

const LOG_CACHE = process.env.LOG_CACHE === 'true';

// Add data to cache.json
async function addCache(cache: MBTACache) {
  // Insert cache data into the database
  await client.db('huddle-chat').collection('mbta-cache').insertOne(cache);

  return cache;
}

// Remove data from cache.json
async function removeCache(cache: MBTACache) {
  const { endpoint, userId, path } = cache;

  // Check if the endpoint is "stops" and the path includes latitude and longitude (cache for each user)
  const stopDistanceCheck =
    endpoint === 'stops' &&
    path.includes('filter[latitude]') &&
    path.includes('filter[longitude]');
  if (stopDistanceCheck) {
    await client
      .db('huddle-chat')
      .collection('mbta-cache')
      .deleteMany({ endpoint, userId });
    return cache;
  }

  await client.db('huddle-chat').collection('mbta-cache').deleteOne({ path });

  return cache;
}

// Return cached data
async function getCachedData(
  endpoint: string,
  path: string,
  userId: string,
): Promise<MBTACache | null> {
  // Check if the endpoint is "stops" and the path includes latitude and longitude (cache for each user)
  const stopDistanceCheck =
    endpoint === 'stops' &&
    path.includes('filter[latitude]') &&
    path.includes('filter[longitude]');

  const cache = await client
    .db('huddle-chat')
    .collection('mbta-cache')
    .findOne(stopDistanceCheck ? { endpoint, userId } : { path });

  if (!cache) {
    return null;
  }

  return {
    userId: cache.userId,
    endpoint: cache.endpoint,
    path: cache.path,
    cachedAt: cache.cachedAt,
    staleTime: cache.staleTime,
    data: cache.data,
  };
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
export async function checkCache(path: string, userId: string) {
  const [endpoint] = splitPath(path);

  const cache = await getCachedData(endpoint, path, userId); // Get cached data

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
      removeCache(cache);

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

  const pathParts = path.split('/').slice(1);

  return pathParts;
}

// Cache data in cache.json
export function cacheData(path: string, data: object, userId?: string) {
  const [endpoint] = splitPath(path);

  const cacheData: MBTACache = {
    endpoint,
    path,
    cachedAt: Date.now(),
    staleTime: 1000 * 30, // 30 seconds
    data,
  };

  // Set the stale time based on the path
  switch (endpoint) {
    case 'schedules':
      cacheData.staleTime = 1000 * 60 * 30; // 30 minutes
      break;
    case 'predictions':
      cacheData.staleTime = 1000 * 60 * 5; // 5 minutes
      break;
    case 'vehicles':
      cacheData.staleTime = 1000 * 30; // 30 seconds
      break;
    case 'stops':
      // Check if the path includes latitude and longitude
      const stopDistanceCheck =
        path.includes('filter[latitude]') && path.includes('filter[longitude]');
      if (stopDistanceCheck) {
        cacheData.userId = userId; // Set the user id for location caches
        cacheData.staleTime = 1000 * 30; // 30 seconds
        break;
      }

      // Default stale time for stops
      cacheData.staleTime = 1000 * 60 * 60 * 5; // 5 hours
      break;
    default:
      break;
  }

  // Write to cache
  addCache(cacheData);
}
