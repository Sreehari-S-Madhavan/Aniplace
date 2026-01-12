-- Initial Data Seeding

-- ============================================
-- PLATFORMS
-- ============================================
INSERT INTO platforms (name, display_name, website_url, region) VALUES
('crunchyroll', 'Crunchyroll', 'https://www.crunchyroll.com/', 'US'),
('netflix', 'Netflix', 'https://www.netflix.com/', 'US'),
('hulu', 'Hulu', 'https://www.hulu.com/', 'US'),
('funimation', 'Funimation', 'https://www.funimation.com/', 'US'),
('prime_video', 'Prime Video', 'https://www.amazon.com/Prime-Video/', 'US'),
('hidive', 'HIDIVE', 'https://www.hidive.com/', 'US'),
('disney_plus', 'Disney+', 'https://www.disneyplus.com/', 'US')
ON CONFLICT DO NOTHING;

-- Get Platform IDs (assuming standard order or fetching them)
-- For a raw SQL script, we rely on knowing the IDs or sub-selects.
-- Since this runs once on empty DB, IDs will likely be 1-7.

-- ============================================
-- ANIME PLATFORMS (Seeding for Popular Anime)
-- ============================================

-- Naruto (ID: 20)
INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 20, id, 'available', 'https://www.crunchyroll.com/series/GY8VM8G1Y/naruto', 'US'
FROM platforms WHERE name = 'crunchyroll';

INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 20, id, 'available', 'https://www.netflix.com/title/70205012', 'US'
FROM platforms WHERE name = 'netflix';

INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 20, id, 'available', 'https://www.hulu.com/series/naruto-993d48dc-d507-47cb-8cca-23e6794f6f66', 'US'
FROM platforms WHERE name = 'hulu';

-- One Piece (ID: 21)
INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 21, id, 'available', 'https://www.crunchyroll.com/series/GRMG8ZQZR/one-piece', 'US'
FROM platforms WHERE name = 'crunchyroll';

INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 21, id, 'available', 'https://www.netflix.com/title/80107103', 'US'
FROM platforms WHERE name = 'netflix';

-- Attack on Titan (ID: 16498)
INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 16498, id, 'available', 'https://www.crunchyroll.com/series/GR751KNZY/attack-on-titan', 'US'
FROM platforms WHERE name = 'crunchyroll';

INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 16498, id, 'available', 'https://www.hulu.com/series/attack-on-titan-9c91ffa3-dc20-48bf-8bc5-692e37c47d88', 'US'
FROM platforms WHERE name = 'hulu';

-- Demon Slayer (ID: 38000)
INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 38000, id, 'available', 'https://www.crunchyroll.com/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba', 'US'
FROM platforms WHERE name = 'crunchyroll';

INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 38000, id, 'available', 'https://www.netflix.com/title/81091393', 'US'
FROM platforms WHERE name = 'netflix';

-- Jujutsu Kaisen (ID: 40748)
INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 40748, id, 'available', 'https://www.crunchyroll.com/series/GRDV0019R/jujutsu-kaisen', 'US'
FROM platforms WHERE name = 'crunchyroll';

-- My Hero Academia (ID: 31964)
INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 31964, id, 'available', 'https://www.crunchyroll.com/series/G6NQ5DWZ6/my-hero-academia', 'US'
FROM platforms WHERE name = 'crunchyroll';

INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 31964, id, 'available', 'https://www.hulu.com/series/my-hero-academia-36e318dc-3daf-47fb-8219-9e3cb5cd5d48', 'US'
FROM platforms WHERE name = 'hulu';

-- Fullmetal Alchemist: Brotherhood (ID: 5114)
INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 5114, id, 'available', 'https://www.crunchyroll.com/series/GRFQ31D36/fullmetal-alchemist-brotherhood', 'US'
FROM platforms WHERE name = 'crunchyroll';

INSERT INTO anime_platforms (anime_id, platform_id, availability_status, url, region) 
SELECT 5114, id, 'available', 'https://www.hulu.com/series/fullmetal-alchemist-brotherhood-19f6a629-6889-4089-a299-4d6d6a273295', 'US'
FROM platforms WHERE name = 'hulu';
