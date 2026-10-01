// ─────────────────────────────────────────────────────────────
// Property ke dropdown options + helpers.
// Backend validation yahin se hoti hai, aur frontend ko ye data
// GET /api/properties/options se milta hai (single source of truth).
// ─────────────────────────────────────────────────────────────

export const PROPERTY_OPTIONS = {
  // status DB mein 'active' hi rehta hai (purana data safe), label "Available" dikhta hai
  status: [
    { value: 'active', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' },
  ],
  furnishing: [
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'furnished', label: 'Fully Furnished' },
  ],
  transaction_type: [
    { value: 'new', label: 'New Property' },
    { value: 'resale', label: 'Resale' },
  ],
  parking: [
    { value: 'none', label: 'No Parking' },
    { value: 'open', label: 'Open Parking' },
    { value: 'covered', label: 'Covered Parking' },
    { value: 'open-covered', label: 'Open + Covered' },
  ],
  facing: [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'north-east', label: 'North-East' },
    { value: 'north-west', label: 'North-West' },
    { value: 'south-east', label: 'South-East' },
    { value: 'south-west', label: 'South-West' },
  ],
  construction_type: [
    { value: 'rcc-framed', label: 'RCC Framed Structure' },
    { value: 'load-bearing', label: 'Load Bearing' },
    { value: 'steel-structure', label: 'Steel Structure' },
    { value: 'prefabricated', label: 'Prefabricated' },
    { value: 'other', label: 'Other' },
  ],
  age_of_property: [
    { value: 'under-construction', label: 'Under Construction' },
    { value: 'new', label: 'Brand New' },
    { value: '0-1', label: 'Less than 1 year' },
    { value: '1-5', label: '1 – 5 years' },
    { value: '5-10', label: '5 – 10 years' },
    { value: '10+', label: '10+ years' },
  ],
  // Quick-pick suggestions (admin apni marzi ka bhi add kar sakta hai)
  amenities_suggestions: [
    'Lift', 'Power Backup', 'Security / CCTV', 'Gated Society', 'Swimming Pool',
    'Gym', 'Club House', 'Children Play Area', 'Park / Garden', 'Water Supply 24x7',
    'Rain Water Harvesting', 'Intercom', 'Visitor Parking', 'Fire Safety',
    'Piped Gas', 'Wi-Fi / Internet', 'Maintenance Staff', 'Temple',
  ],
  highlights_suggestions: [
    'Vastu Compliant', 'Corner Property', 'Park Facing', 'Main Road Facing',
    'Newly Renovated', 'Ready to Move', 'Gated Community', 'Close to Metro',
    'Modular Kitchen', 'Wooden Flooring', 'Premium Location', 'Bank Loan Available',
  ],
  landmarks_suggestions: [
    'Metro Station', 'Bus Stop', 'School', 'Hospital', 'Mall', 'Market',
    'Railway Station', 'Airport', 'Highway', 'Park', 'Temple', 'ATM / Bank',
  ],
};

const enumValues = (key) => PROPERTY_OPTIONS[key].map((o) => o.value);

// Text array fields (DB mein JSON string ke roop mein store hote hain)
export const LIST_FIELDS = ['amenities', 'property_highlights', 'nearby_landmarks'];

// Simple enum/string fields jo options se validate hote hain
export const ENUM_FIELDS = {
  furnishing: enumValues('furnishing'),
  transaction_type: enumValues('transaction_type'),
  parking: enumValues('parking'),
  facing: enumValues('facing'),
  construction_type: enumValues('construction_type'),
  age_of_property: enumValues('age_of_property'),
  status: enumValues('status'),
};

export const INT_FIELDS = ['bedrooms', 'bathrooms', 'balcony', 'total_floors'];

const toList = (v) => {
  if (Array.isArray(v)) {
    return v.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof v === 'string') {
    // "a, b, c" ya newline-separated string bhi chalega
    return v.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const toIntOrNull = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/**
 * Request body se sirf allowed property fields nikalta hai aur clean karta hai.
 * Returns { data, error }.  `partial: true` => sirf wahi fields jo body mein aaye (PUT ke liye)
 */
export function sanitizePropertyInput(body, { partial = false } = {}) {
  const has = (k) => Object.prototype.hasOwnProperty.call(body, k);
  const data = {};

  for (const k of ['title', 'description', 'location', 'city']) {
    if (!partial || has(k)) data[k] = typeof body[k] === 'string' ? body[k].trim() : body[k];
  }

  if (!partial || has('price')) data.price = body.price;
  if (!partial || has('area')) {
    data.area = body.area === '' || body.area == null ? null : body.area;
  }

  if (!partial || has('type')) {
    data.type = body.type ? String(body.type).toLowerCase() : body.type;
  }
  if (!partial || has('property_type')) {
    data.property_type = body.property_type
      ? String(body.property_type).toLowerCase()
      : body.property_type;
  }

  for (const k of INT_FIELDS) {
    if (!partial || has(k)) data[k] = toIntOrNull(body[k]);
  }

  for (const k of LIST_FIELDS) {
    if (!partial || has(k)) data[k] = toList(body[k]);
  }

  for (const [k, allowed] of Object.entries(ENUM_FIELDS)) {
    if (!partial && !has(k)) continue;
    if (!has(k)) continue;
    const v = body[k] === '' || body[k] == null ? null : String(body[k]);
    if (v !== null && !allowed.includes(v)) {
      return { error: `Invalid value for ${k}` };
    }
    // status null nahi ho sakta
    if (k === 'status' && v === null) continue;
    data[k] = v;
  }

  return { data };
}
