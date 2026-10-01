'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const GOLD_LINE =
  'linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)';

const typeColors = {
  buy:  { bg: '#f3f0E8', text: '#1a2a22' },
  sell: { bg: 'rgba(255,205,57,0.2)', text: '#a06a00' },
  rent: { bg: '#e6ebe8', text: '#52685B' },
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchProperties = () => {
  setLoading(true);

  fetch('/api/admin/properties')
    .then(async (res) => {
      const data = await res.json();

      // ✅ SAFE NORMALIZATION (IMPORTANT)
      const list = Array.isArray(data)
        ? data
        : data?.data || [];

      setProperties(list);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setProperties([]); // fallback so UI never crashes
      setLoading(false);
    });
};
  useEffect(() => { fetchProperties(); }, []);

  const deleteProperty = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) fetchProperties();
      else alert('Delete failed: ' + data.error);
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}
      >
        <div>
          <p style={{
            fontSize: '11px', color: '#52685B', letterSpacing: '0.25em',
            textTransform: 'uppercase', fontWeight: '500', marginBottom: '6px',
          }}>Management</p>
          <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '38px', color: '#1a2a22', lineHeight: 1 }}>
            Properties
          </h1>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/admin/properties/add" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px',
            background: '#1a2a22',
            color: '#faf9f6',
            border: '1px solid rgba(226,161,13,0.5)',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 16px rgba(26,42,34,0.25)',
          }}>
            <span style={{ fontSize: '18px', lineHeight: 1, color: '#ffcd39' }}>+</span>
            Add Property
          </Link>
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e8e3d3',
          boxShadow: '0 2px 16px rgba(26,42,34,0.07)',
        }}
      >
        {/* Top gold hairline */}
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '2px', background: GOLD_LINE }} />

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr 1fr',
          padding: '14px 24px',
          background: '#f3f0E8',
          borderBottom: '1px solid #e8e3d3',
        }}>
          {['Title', 'Price', 'Type', 'City', 'Status', 'Actions'].map(h => (
            <span key={h} style={{
              fontSize: '11px', color: '#52685B', fontWeight: '600',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>{h}</span>
          ))}
        </div>

        <AnimatePresence>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }}
                style={{ color: '#52685B', fontSize: '14px' }}>
                Loading properties...
              </motion.div>
            </div>
          ) : properties.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5, color: '#e2a10d' }}>⌂</div>
              <p style={{ color: '#52685B', fontSize: '14px' }}>No properties listed yet</p>
            </motion.div>
          ) : (
            properties.map((p, i) => {
              const tc = typeColors[p.type] || typeColors.buy;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ background: '#faf9f6' }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr 1fr',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f3f0E8',
                    alignItems: 'center',
                  }}
                >
                  {/* Title */}
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a2a22' }}>{p.title}</span>

                  {/* Price */}
                  <span style={{ fontSize: '13px', color: '#a06a00', fontWeight: '600' }}>
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </span>

                  {/* Type */}
                  <span style={{
                    display: 'inline-flex',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    background: tc.bg,
                    color: tc.text,
                    width: 'fit-content',
                  }}>
                    {p.type?.toUpperCase()}
                  </span>

                  {/* City */}
                  <span style={{ fontSize: '13px', color: '#52685B' }}>{p.city}</span>

                  {/* Status */}
                  <span style={{
                    display: 'inline-flex',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: p.status === 'active' ? '#f3f0E8' : '#fef0f0',
                    color: p.status === 'active' ? '#1a2a22' : '#c0392b',
                    border: p.status === 'active' ? '1px solid rgba(226,161,13,0.5)' : '1px solid transparent',
                    width: 'fit-content',
                  }}>
                    {p.status}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href={`/admin/properties/edit/${p.id}`} style={{
                        padding: '6px 14px',
                        background: '#f3f0E8',
                        border: '1px solid #e8e3d3',
                        borderRadius: '8px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        color: '#1a2a22',
                        fontWeight: '500',
                      }}>
                        Edit
                      </Link>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteProperty(p.id)}
                      style={{
                        padding: '6px 14px',
                        background: '#fef0f0',
                        color: '#c0392b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontFamily: "'Jost', sans-serif",
                      }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {properties.length > 0 && (
          <div style={{
            padding: '12px 24px',
            background: '#faf9f6',
            borderTop: '1px solid #e8e3d3',
          }}>
            <p style={{ fontSize: '12px', color: '#52685B' }}>
              {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} total
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}