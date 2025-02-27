import { User } from '../types/user';
import { cacheData, checkCache } from './cache';

const MBTA_API_BASE_URL = process.env.MBTA_API_BASE_URL as string;
const MBTA_API_KEY = process.env.MBTA_API_KEY as string;
const DISABLE_CACHE = process.env.DISABLE_CACHE === 'true';

export default async function requestMbta(path: string, user?: User) {
  // Check if caching is disabled
  if (!DISABLE_CACHE) {
    // Check if the request is cached
    const cachedData = await checkCache(path, user?.id as string);

    // If the request is cached, return the cached data
    if (cachedData) {
      return cachedData;
    }
  }

  const req = await fetch(`${MBTA_API_BASE_URL}${path}`, {
    headers: {
      'x-api-key': MBTA_API_KEY,
    },
  });

  if (!req.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  const { data } = await req.json();

  // Cache the response
  cacheData(path, data, user?.id);

  return data;
}
