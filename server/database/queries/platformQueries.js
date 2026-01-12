/**
 * Platform Queries
 *
 * Database queries for streaming platforms.
 */

const pool = require('../db')

/**
 * Get all active platforms
 */
async function getAllPlatforms(region = 'US') {
  const query = `
    SELECT id, name, display_name, website_url, logo_url, region
    FROM platforms
    WHERE is_active = true AND region = $1
    ORDER BY display_name
  `

  const result = await pool.query(query, [region])
  return result.rows
}

/**
 * Get platforms for a specific anime
 */
async function getPlatformsForAnime(animeId, region = 'US') {
  const query = `
    SELECT
      p.id,
      p.name,
      p.display_name,
      p.website_url,
      p.logo_url,
      ap.availability_status,
      ap.url as direct_url,
      ap.region
    FROM anime_platforms ap
    JOIN platforms p ON ap.platform_id = p.id
    WHERE ap.anime_id = $1 AND ap.region = $2 AND p.is_active = true
    ORDER BY p.display_name
  `

  const result = await pool.query(query, [animeId, region])
  return result.rows
}

/**
 * Add platform availability for an anime
 */
async function addAnimePlatform(animeId, platformId, availabilityStatus = 'available', url = null, region = 'US') {
  const query = `
    INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (anime_id, platform_id, region)
    DO UPDATE SET
      availability_status = EXCLUDED.availability_status,
      url = EXCLUDED.url,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, anime_id, platform_id, availability_status, url, region
  `

  const result = await pool.query(query, [animeId, platformId, availabilityStatus, url, region])
  return result.rows[0]
}

/**
 * Search for anime platforms (for admin/seeding purposes)
 */
async function searchAnimePlatforms(searchTerm, limit = 20) {
  const query = `
    SELECT DISTINCT
      ap.anime_id,
      COUNT(ap.platform_id) as platform_count
    FROM anime_platforms ap
    JOIN platforms p ON ap.platform_id = p.id
    WHERE p.is_active = true
    GROUP BY ap.anime_id
    ORDER BY platform_count DESC
    LIMIT $1
  `

  const result = await pool.query(query, [limit])
  return result.rows
}

module.exports = {
  getAllPlatforms,
  getPlatformsForAnime,
  addAnimePlatform,
  searchAnimePlatforms
}