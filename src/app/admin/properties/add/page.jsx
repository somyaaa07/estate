'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PropertyForm, { COLORS } from '@/component/admin/PropertyForm';

export default function AddPropertyPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/properties');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || data.message || 'Something went wrong.');
    } catch {
      setError('Network error. Try again.');
    }
    setLoading(false);
  };

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
            <p style={{ fontSize: '12px', color: COLORS.muted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              Property Management
            </p>
            <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '30px', color: COLORS.text, margin: '4px 0 0' }}>
              Add New Property
            </h1>
            <div style={{ height: '2px', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}, transparent)`, borderRadius: '2px', marginTop: '16px' }} />
          </motion.div>

          <PropertyForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Save Property"
            onCancel={() => router.push('/admin/properties')}
          />
        </div>
      </div>
    </>
  );
}
