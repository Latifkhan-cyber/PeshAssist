-- ==========================================================
-- PeshAssist - PostgreSQL / Supabase Complete Schema
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AREAS TABLE
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    zone VARCHAR(100) DEFAULT 'Peshawar',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PLACES TABLE
CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    urdu_name VARCHAR(255),
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    area_id INT REFERENCES areas(id) ON DELETE SET NULL,
    category_slug VARCHAR(100),
    area_name VARCHAR(100),
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(255),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    price_range VARCHAR(10) DEFAULT '₨₨', -- ₨, ₨₨, ₨₨₨
    opening_hours JSONB DEFAULT '{"mon_fri": "9:00 AM - 11:00 PM", "sat_sun": "10:00 AM - 12:00 AM"}',
    rating DECIMAL(3, 2) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    cover_image TEXT,
    amenities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    user_id UUID,
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'approved', -- 'approved', 'pending', 'flagged'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);

-- 6. SEARCH_HISTORY TABLE
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    query TEXT NOT NULL,
    language VARCHAR(20) DEFAULT 'en',
    results_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CONVERSATIONS & CHAT MESSAGES
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    places_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR FAST GEOGRAPHIC & TEXT SEARCH
CREATE INDEX IF NOT EXISTS idx_places_area ON places(area_id);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);
CREATE INDEX IF NOT EXISTS idx_places_rating ON places(rating DESC);
CREATE INDEX IF NOT EXISTS idx_places_name ON places USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
