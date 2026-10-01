# Changes (Admin-only version)

## Removed
- Agent role: model, `/api/admin/agents*`, `/admin/agents*`, agent card, agent stats
- User property listing: `/dashboard/list-property`, `/api/user/properties`

## Admin
- First-time admin register: `/admin/signup` (sirf jab koi admin nahi hai; uske baad band). Role hamesha `admin`.
- Property add / edit / delete / Available-Sold toggle: `/admin/properties`
- Inquiries: `/admin/inquiries` + email sabhi admins ko (optional extra: `ADMIN_NOTIFY_EMAIL=a@x.com,b@x.com` in .env.local)
- Admin APIs ab protected hain (`requireAdmin`)

## New property fields (backend -> frontend)
nearby_landmarks, status (Available/Sold/Rented), amenities, property_highlights, age_of_property,
furnishing, transaction_type, balcony, total_floors, parking, facing, construction_type.
Dropdown options: `GET /api/properties/options`.
Purani DB automatically migrate hoti hai (naye columns add) — manual SQL ki zaroorat nahi.

## Fixed
- Public listing API (`/api/properties`) galat file mein tha -> website ke pages ab `/api/properties` use karte hain
- `/admin/signup` proxy se block hota tha
- `next build` (Turbopack) config error
