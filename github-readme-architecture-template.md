# Tech Stack & Architecture

## Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend and Database: Supabase, PostgreSQL, Supabase Auth, Row Level Security (RLS)
- Deployment: Vercel / Netlify
- Tools: Git, GitHub

## Architecture Summary

This project uses a frontend-first product architecture backed by Supabase as the Backend-as-a-Service layer. Supabase handles authentication, PostgreSQL data storage, relational queries, and security policies through Row Level Security.

## Database Schema

| Table | Purpose | Key Fields |
|---|---|---|
| profiles | Stores user profile and public identity data | id, username, display_name, avatar_url, created_at |
| friends | Tracks friend relationships between users | id, requester_id, receiver_id, status, created_at |
| traits | Stores available personality/vibe traits | id, name, category, created_at |
| votes | Records one trait vote from one user to another | id, voter_id, target_user_id, trait_id, created_at |
| messages | Stores user-to-user messages | id, sender_id, receiver_id, content, created_at |
| premium_cards | Stores generated premium visual identity card data | id, user_id, card_type, image_url, created_at |

## Security Model

- Supabase Auth manages authenticated sessions.
- Row Level Security policies restrict users to their own profile, friend, vote, and message data.
- Public profile data is separated from private user-owned data where needed.
- Relational access patterns are designed to avoid exposing unrelated user records.

## Key Engineering Decisions

- Used PostgreSQL relational tables instead of flat JSON storage so friend relationships, votes, traits, and messages can be queried reliably.
- Used RLS policies to enforce database-level access control rather than relying only on frontend checks.
- Kept the frontend product flow tightly connected to backend schema design so UI features map clearly to data models.
