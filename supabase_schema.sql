-- Conversational Travel Planner Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Flight searches table (for history and analytics)
CREATE TABLE IF NOT EXISTS flight_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date DATE,
    departure_date_range_start DATE,
    departure_date_range_end DATE,
    return_date DATE,
    return_date_range_start DATE,
    return_date_range_end DATE,
    passenger_count INTEGER DEFAULT 1,
    trip_type VARCHAR(20) CHECK (trip_type IN ('one-way', 'round-trip')),
    preferences JSONB, -- Store user preferences like 'cheapest', 'fastest', etc.
    search_results JSONB, -- Store the search results for reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date_range_start DATE NOT NULL,
    departure_date_range_end DATE NOT NULL,
    return_date_range_start DATE,
    return_date_range_end DATE,
    trip_type VARCHAR(20) CHECK (trip_type IN ('one-way', 'round-trip')),
    threshold_price DECIMAL(10, 2), -- Optional price threshold
    last_known_price DECIMAL(10, 2),
    last_checked_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT TRUE,
    notification_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversation history table (for maintaining context)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB NOT NULL, -- Array of message objects
    context JSONB, -- Store extracted entities and conversation state
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Outbound clicks table (for analytics)
CREATE TABLE IF NOT EXISTS outbound_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    flight_search_id UUID REFERENCES flight_searches(id) ON DELETE SET NULL,
    booking_url TEXT NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_flight_searches_user_id ON flight_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_searches_created_at ON flight_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(active);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_outbound_clicks_user_id ON outbound_clicks(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON price_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_clicks ENABLE ROW LEVEL SECURITY;

-- Users policies
-- Allow service role full access (for API routes)
CREATE POLICY "Service role can do everything on users"
    ON users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Flight searches policies
CREATE POLICY "Service role can do everything on flight_searches"
    ON flight_searches
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Price alerts policies
CREATE POLICY "Service role can do everything on price_alerts"
    ON price_alerts
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Conversations policies
CREATE POLICY "Service role can do everything on conversations"
    ON conversations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Outbound clicks policies
CREATE POLICY "Service role can do everything on outbound_clicks"
    ON outbound_clicks
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
