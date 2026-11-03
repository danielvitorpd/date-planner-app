import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Run `vercel env pull .env.local --yes` first.");
}

const sql = neon(process.env.DATABASE_URL);

await sql.query(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
await sql.query("CREATE INDEX IF NOT EXISTS events_event_date_index ON events (event_date)");
await sql.query(`
  INSERT INTO events (id, title, description, event_date, photo_url)
  VALUES
    ('first-date', 'Our first date', 'Coffee turned into a long walk and the easiest conversation.', '2026-02-14', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80'),
    ('weekend-away', 'Weekend by the sea', 'Slow mornings, salty hair, and our favorite sunset so far.', '2026-05-23', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'),
    ('anniversary', 'First anniversary', 'A night to celebrate everything we have learned together.', '2026-11-14', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80')
  ON CONFLICT (id) DO NOTHING
`);

console.log("Database schema is ready.");
