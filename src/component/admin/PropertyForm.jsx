'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/component/ImageUploads';

export const COLORS = {
  primary: '#2e5d42',
  primaryLight: '#3d7a58',
  primaryPale: '#e8f0eb',
  bg: '#fafaef',
  white: '#ffffff',
  border: '#d6ddd8',
  text: '#1a2e22',
  muted: '#6b7c72',
  accent: '#c8a96e',
  error: '#c0392b',
};

export const EMPTY_PROPERTY_FORM = {
  title: '',
  description: '',
  price: '',
  type: 'buy',
  property_type: 'apartment',
  status: 'active',
  location: '',
  city: '',
  area: '',
  nearby_landmarks: [],
  bedrooms: '',
  bathrooms: '',
  balcony: '',
  total_floors: '',
  age_of_property: '',
  furnishing: '',
  transaction_type: '',
  parking: '',
  facing: '',
  construction_type: '',
  property_highlights: [],
  amenities: [],
  images: [],
};

/* Property object from DB/API -> form state */
export function propertyToForm(p) {
  const f = { ...EMPTY_PROPERTY_FORM };
  for (const key of Object.keys(EMPTY_PROPERTY_FORM)) {
    if (key === 'images') continue;
    const v = p[key];
    if (Array.isArray(EMPTY_PROPERTY_FORM[key])) f[key] = Array.isArray(v) ? v : [];
    else f[key] = v === null || v === undefined ? '' : String(v);
  }
  f.images = (p.images || []).map((img) => img.url);
  return f;
}

/* ─────────────── small UI pieces ─────────────── */

const fieldStyle = {
  width: '100%',
  padding: '12px 16px',
  fontFamily: "'Jost', sans-serif",
  fontSize: '15px',
  color: COLORS.text,
  background: COLORS.white,
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: '10px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232e5d42' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`;

function Field({ as: Tag = 'input', style: extra, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...fieldStyle,
        ...(Tag === 'textarea' ? { resize: 'vertical', minHeight: '100px' } : {}),
        ...(Tag === 'select'
          ? {
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: selectArrow,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '38px',
            }
          : {}),
        borderColor: focused ? COLORS.primary : COLORS.border,
        boxShadow: focused ? `0 0 0 3px ${COLORS.primaryPale}` : 'none',
        ...extra,
      }}
    />
  );
}

function Label({ children }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: "'Jost', sans-serif",
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: COLORS.primary,
        marginBottom: '8px',
      }}
    >
      {children}
    </label>
  );
}

function Item({ label, span = false, children }) {
  return (
    <div style={{ gridColumn: span ? '1 / -1' : undefined }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Section({ title, icon, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: COLORS.white,
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.primaryPale}`,
          background: COLORS.primaryPale,
        }}
      >
        <span style={{ color: COLORS.primary, fontSize: '14px' }}>{icon}</span>
        <h2
          style={{
            fontFamily: "'Marcellus', serif",
            fontSize: '17px',
            color: COLORS.primary,
            fontWeight: 400,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </motion.div>
  );
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
};

/* Chips + custom input (amenities / highlights / landmarks) */
function TagInput({ value = [], onChange, suggestions = [], placeholder }) {
  const [text, setText] = useState('');

  const has = (t) => value.some((v) => v.toLowerCase() === t.toLowerCase());
  const add = (t) => {
    const clean = t.trim();
    if (!clean || has(clean)) return;
    onChange([...value, clean]);
  };
  const remove = (t) => onChange(value.filter((v) => v !== t));
  const toggle = (t) => (has(t) ? remove(value.find((v) => v.toLowerCase() === t.toLowerCase())) : add(t));

  const commit = () => {
    text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach(add);
    setText('');
  };

  const chip = (selected) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontFamily: "'Jost', sans-serif",
    cursor: 'pointer',
    border: `1.5px solid ${selected ? COLORS.primary : COLORS.border}`,
    background: selected ? COLORS.primary : COLORS.white,
    color: selected ? '#fff' : COLORS.muted,
    transition: 'all 0.15s',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Field
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commit();
            }
          }}
        />
        <button
          type="button"
          onClick={commit}
          style={{
            padding: '0 20px',
            borderRadius: '10px',
            border: 'none',
            background: COLORS.primary,
            color: '#fff',
            fontFamily: "'Jost', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>

      {suggestions.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '12px', color: COLORS.muted, margin: '0 0 8px' }}>Quick add:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => toggle(s)} style={chip(has(s))}>
                {has(s) ? '✓ ' : '+ '}
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom (not in suggestions) */}
      {value.filter((v) => !suggestions.some((s) => s.toLowerCase() === v.toLowerCase())).length > 0 && (
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {value
            .filter((v) => !suggestions.some((s) => s.toLowerCase() === v.toLowerCase()))
            .map((v) => (
              <span key={v} style={chip(true)} onClick={() => remove(v)} title="Click to remove">
                ✓ {v} ✕
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── MAIN FORM ─────────────── */

export default function PropertyForm({
  initial = EMPTY_PROPERTY_FORM,
  onSubmit,
  submitLabel = 'Save Property',
  loadingLabel = 'Saving…',
  loading = false,
  error = '',
  onCancel,
}) {
  const [form, setForm] = useState(initial);
  const [opts, setOpts] = useState(null);
  const [localError, setLocalError] = useState('');

  // Dropdown options from the backend
  useEffect(() => {
    fetch('/api/properties/options')
      .then((r) => r.json())
      .then(setOpts)
      .catch(() => setLocalError('Could not load form options. Refresh the page.'));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setList = (key) => (arr) => setForm((f) => ({ ...f, [key]: arr }));

  const handleSubmit = () => {
    setLocalError('');
    if (!form.title.trim() || !form.price || !form.city.trim() || !form.location.trim()) {
      setLocalError('Title, Price, Location and City are required.');
      return;
    }
    if (form.images.length === 0) {
      setLocalError('Please upload at least one image.');
      return;
    }
    onSubmit(form);
  };

  const renderSelect = (k, options, placeholder) => (
    <Field as="select" value={form[k]} onChange={set(k)}>
      {placeholder && <option value="">{placeholder}</option>}
      {(options || []).map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Field>
  );

  const shownError = localError || error;

  return (
    <>
      <AnimatePresence>
        {shownError && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#fdf0ef',
              border: `1px solid ${COLORS.error}30`,
              borderLeft: `4px solid ${COLORS.error}`,
              borderRadius: '10px',
              padding: '12px 16px',
              color: COLORS.error,
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            {shownError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic */}
      <Section title="Basic Information" icon="✦" delay={0}>
        <div style={grid}>
          <Item label="Property Title" span>
            <Field placeholder="e.g. Luxury Villa in Sector 45" value={form.title} onChange={set('title')} />
          </Item>
          <Item label="Description" span>
            <Field as="textarea" placeholder="Describe the property…" value={form.description} onChange={set('description')} />
          </Item>
          <Item label="Price (₹)">
            <Field type="number" min="0" placeholder="5000000" value={form.price} onChange={set('price')} />
          </Item>
          <Item label="Listing Type">
            <Field as="select" value={form.type} onChange={set('type')}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
            </Field>
          </Item>
          <Item label="Property Type">
            <Field as="select" value={form.property_type} onChange={set('property_type')}>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </Field>
          </Item>
          <Item label="Availability">
            {renderSelect('status', opts?.status)}
          </Item>
        </div>
      </Section>

      {/* Location */}
      <Section title="Location Details" icon="◈" delay={0.05}>
        <div style={grid}>
          <Item label="Full Location / Address" span>
            <Field placeholder="Sector 45, Noida, Uttar Pradesh" value={form.location} onChange={set('location')} />
          </Item>
          <Item label="City">
            <Field placeholder="Noida" value={form.city} onChange={set('city')} />
          </Item>
          <Item label="Area (sq ft)">
            <Field type="number" min="0" placeholder="1200" value={form.area} onChange={set('area')} />
          </Item>
          <Item label="Nearby Landmarks" span>
            <TagInput
              value={form.nearby_landmarks}
              onChange={setList('nearby_landmarks')}
              suggestions={opts?.landmarks_suggestions}
              placeholder="e.g. Metro Station 500m, City Mall 1km (press Enter)"
            />
          </Item>
        </div>
      </Section>

      {/* Specs */}
      <Section title="Property Specifications" icon="◇" delay={0.1}>
        <div style={grid}>
          <Item label="Bedrooms">
            <Field type="number" min="0" placeholder="3" value={form.bedrooms} onChange={set('bedrooms')} />
          </Item>
          <Item label="Bathrooms">
            <Field type="number" min="0" placeholder="2" value={form.bathrooms} onChange={set('bathrooms')} />
          </Item>
          <Item label="Balconies">
            <Field type="number" min="0" placeholder="1" value={form.balcony} onChange={set('balcony')} />
          </Item>
          <Item label="Total Floors">
            <Field type="number" min="0" placeholder="4" value={form.total_floors} onChange={set('total_floors')} />
          </Item>
          <Item label="Age of Property">
            {renderSelect('age_of_property', opts?.age_of_property, 'Select')}
          </Item>
          <Item label="Furnishing">
            {renderSelect('furnishing', opts?.furnishing, 'Select')}
          </Item>
          <Item label="Transaction Type">
            {renderSelect('transaction_type', opts?.transaction_type, 'Select')}
          </Item>
          <Item label="Parking">
            {renderSelect('parking', opts?.parking, 'Select')}
          </Item>
          <Item label="Facing">
            {renderSelect('facing', opts?.facing, 'Select')}
          </Item>
          <Item label="Construction Type">
            {renderSelect('construction_type', opts?.construction_type, 'Select')}
          </Item>
        </div>
      </Section>

      {/* Highlights + Amenities */}
      <Section title="Highlights & Amenities" icon="★" delay={0.15}>
        <div style={{ display: 'grid', gap: '28px' }}>
          <Item label="Property Highlights">
            <TagInput
              value={form.property_highlights}
              onChange={setList('property_highlights')}
              suggestions={opts?.highlights_suggestions}
              placeholder="e.g. Vastu Compliant (press Enter)"
            />
          </Item>
          <Item label="Amenities">
            <TagInput
              value={form.amenities}
              onChange={setList('amenities')}
              suggestions={opts?.amenities_suggestions}
              placeholder="e.g. Swimming Pool (press Enter)"
            />
          </Item>
        </div>
      </Section>

      {/* Images */}
      <Section title="Property Images" icon="▣" delay={0.2}>
        <ImageUpload value={form.images} onChange={(urls) => setForm((f) => ({ ...f, images: urls }))} />
      </Section>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '13px 32px',
            background: loading ? COLORS.muted : COLORS.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontFamily: "'Jost', sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? loadingLabel : submitLabel}
        </motion.button>

        {onCancel && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCancel}
            style={{
              padding: '13px 24px',
              background: 'transparent',
              color: COLORS.muted,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '10px',
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </motion.button>
        )}
      </div>
    </>
  );
}