'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Home } from 'lucide-react';
import PropertyForm, { marcellus, propertyToForm } from '@/component/admin/PropertyForm';

const shell = `${marcellus.variable} mx-auto max-w-5xl pb-16 font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22]`;

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [title, setTitle] = useState('');
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
      .then((data) => {
        if (!data) return;
        setTitle(data.title || '');
        setInitial(propertyToForm(data));
      })
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => router.push('/admin/properties'), 1200);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || data.message || 'Failed to update property. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Network error. Check your connection and try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  /* ── Not found ── */
  if (notFound) {
    return (
      <div className={shell}>
        <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-3xl bg-[#FAF9F6] px-8 py-14 text-center shadow-[0_10px_40px_rgba(26,42,34,0.08)] ring-1 ring-[#52685B]/15">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F0E8]">
            <Home className="text-[#D4A62A]" size={26} strokeWidth={1.4} />
          </span>
          <h1 className="mt-5 text-2xl">Property not found</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#52685B]">
            This listing may have been deleted, or the link is incorrect.
          </p>
          <Link
            href="/admin/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A2A22] px-6 py-2.5 text-sm text-[#FAF9F6] transition hover:bg-[#52685B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            Back to properties <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Loading skeleton (matches the form's layout, so nothing jumps) ── */
  if (!initial) {
    return (
      <div className={shell} role="status" aria-label="Loading property">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-36 animate-pulse rounded-full bg-[#F3F0E8]" />
          <div className="h-12 w-72 animate-pulse rounded-xl bg-[#F3F0E8]" />
        </div>
        <div className="space-y-6">
          {[260, 220, 300].map((h) => (
            <div key={h} className="animate-pulse rounded-3xl bg-[#F3F0E8]" style={{ height: h }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={shell}>
      <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 rounded-full text-sm text-[#52685B] transition hover:text-[#1A2A22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <ArrowLeft size={15} /> Back to properties
        </Link>

        <p className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#52685B]">
          Property #{id} <span className="h-px w-12 bg-[#52685B]/40" />
        </p>
        <h1 className="mt-3 text-4xl leading-none sm:text-5xl">Edit Property</h1>
        {title && (
          <p className="mt-3 max-w-xl truncate text-sm text-[#52685B]">Editing: {title}</p>
        )}
      </motion.header>

      <AnimatePresence>
        {saved && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border-l-4 border-[#D4A62A] bg-[#F3F0E8] px-5 py-4 text-sm text-[#1A2A22]"
          >
            <CheckCircle2 size={18} className="shrink-0 text-[#D4A62A]" />
            Property updated. Taking you back to the list…
          </motion.div>
        )}
      </AnimatePresence>

      <PropertyForm
        initial={initial}
        onSubmit={handleSubmit}
        loading={loading || saved}
        error={error}
        submitLabel="Update Property"
        loadingLabel={saved ? 'Updated' : 'Updating…'}
        onCancel={() => router.push('/admin/properties')}
      />
    </div>
  );
}