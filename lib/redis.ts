import Redis from "ioredis"

// Server-side Redis client for Next.js API routes
// Gracefully handles connection failures — all operations are best-effort
let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis

  const url = process.env.REDIS_URL || "redis://localhost:6379"
  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })

    redis.on("error", () => {
      // Silently handle — caching is best-effort
    })

    redis.connect().catch(() => {
      redis = null
    })

    return redis
  } catch {
    return null
  }
}

/**
 * Get a cached value. Returns null if Redis is unavailable or key doesn't exist.
 */
export async function cacheGet<T = unknown>(key: string): Promise<T | null> {
  const r = getRedis()
  if (!r) return null
  try {
    const val = await r.get(key)
    if (val === null) {
      console.log(`[CACHE MISS] ${key}`)
      return null
    }
    console.log(`[CACHE HIT] ${key}`)
    return JSON.parse(val) as T
  } catch {
    return null
  }
}

/**
 * Set a cached value with TTL in seconds.
 */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const r = getRedis()
  if (!r) return
  try {
    await r.set(key, JSON.stringify(value), "EX", ttlSeconds)
  } catch {
    // Best-effort
  }
}
