'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PropertyForm, { COLORS, propertyToForm } from '@/component/admin/PropertyForm';

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => data && setInitial(propertyToForm(data)))
      .catch(() => setNotFound(true));
  }, [id]);

  const handleSubmit = async (form) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => router.push('/admin/properties'), 1000);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || data.message || 'Failed to update property.');
    } catch {
      setError('Network error. Try again.');
    }
    setLoading(false);
  };

  if (notFound) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', fontFamily: "'Jost', sans-serif", color: COLORS.muted }}>
        Property not found.{' '}
        <button onClick={() => router.push('/admin/properties')} style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Back to properties
        </button>
      </div>
    );
  }

  if (!initial) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', fontFamily: "'Jost', sans-serif", color: COLORS.muted }}>
        <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>
          Fetching property data…
        </motion.p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        input::placeholder, textarea::placeholder { color: #a0b0a8; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      <div style={{ padding: '0 0 60px', fontFamily: "'Jost', sans-serif" }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
            <button
              onClick={() => router.push('/admin/properties')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, fontSize: '13px', padding: 0, marginBottom: '16px', fontFamily: "'Jost', sans-serif" }}
            >
              ← Back to Properties
            </button>
            <p style={{ fontSize: '12px', color: COLORS.muted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              Property #{id}
            </p>
            <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '30px', color: COLORS.text, margin: '4px 0 0' }}>
              Edit Property
            </h1>
            <div style={{ height: '2px', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}, transparent)`, borderRadius: '2px', marginTop: '16px' }} />
          </motion.div>

          {saved && (
            <div style={{ background: '#eaf4ef', borderLeft: '4px solid #1a6b3c', borderRadius: '10px', padding: '12px 16px', color: '#1a6b3c', fontSize: '14px', marginBottom: '20px' }}>
              ✓ Property updated! Redirecting…
            </div>
          )}

          <PropertyForm
            initial={initial}
            onSubmit={handleSubmit}
            loading={loading || saved}
            error={error}
            submitLabel="Update Property"
            loadingLabel={saved ? '✓ Updated!' : 'Updating…'}
            onCancel={() => router.push('/admin/properties')}
          />
        </div>
      </div>
    </>
  );
}
