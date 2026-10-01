'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PropertyForm, { marcellus } from '@/component/admin/PropertyForm';

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
      setError(data.error || data.message || 'Something went wrong. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Network error. Check your connection and try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  return (
    <div
      className={`${marcellus.variable} mx-auto max-w-5xl pb-16 font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22]`}
    >
      <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 rounded-full text-sm text-[#52685B] transition hover:text-[#1A2A22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <ArrowLeft size={15} /> Back to properties
        </Link>

        <p className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#52685B]">
          Property Management <span className="h-px w-12 bg-[#52685B]/40" />
        </p>
        <h1 className="mt-3 text-4xl leading-none sm:text-5xl">Add New Property</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#52685B]">
          Fill in the details below. Fields marked * are required; everything else can be added later.
        </p>
      </motion.header>

      <PropertyForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitLabel="Save Property"
        loadingLabel="Saving…"
        onCancel={() => router.push('/admin/properties')}
      />
    </div>
  );
}