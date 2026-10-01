'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Marcellus } from 'next/font/google';
import { motion } from 'framer-motion';
import { ArrowRight, Home, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

/* Palette — Primary #1A2A22 | Secondary #52685B | BG #FAF9F6 / #F3F0E8 | Gold #D4A62A */
const typeStyles = {
  buy: 'bg-[#E3EAE5] text-[#1A2A22]',
  sell: 'bg-[#F6ECCB] text-[#8A6A14]',
  rent: 'bg-[#E6E9EE] text-[#3F5470]',
};

const statusStyles = {
  active: 'bg-[#E3EAE5] text-[#1A2A22]',
  sold: 'bg-[#F6E3DF] text-[#9C3B2B]',
  rented: 'bg-[#E6E9EE] text-[#3F5470]',
};

const COLS = 'lg:grid-cols-[2.5fr_1.3fr_0.9fr_1fr_1.1fr_1.2fr]';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = () => {
    setLoading(true);
    fetch('/api/admin/properties')
      .then(async (res) => {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        setProperties(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setProperties([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const changeStatus = async (id, status) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('failed');
    } catch {
      alert('Status update failed');
      fetchProperties();
    }
  };

  const deleteProperty = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) fetchProperties();
      else alert('Delete failed: ' + (data.error || data.message));
    } catch {
      alert('Something went wrong');
    }
  };

  return (
    <div
      className={`${marcellus.variable} font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22]`}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#52685B]">
            Management
            <span className="h-px w-12 bg-[#52685B]/40" />
          </p>
          <h1 className="mt-3 text-4xl leading-none sm:text-5xl">Properties</h1>
          <p className="mt-3 text-sm text-[#52685B]">
            Add, edit and track every listing in one place.
          </p>
        </div>

        <Link
          href="/admin/properties/add"
          className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <span className="relative z-10">Add Property</span>
          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
            <Plus size={15} className="transition-transform duration-500 group-hover:rotate-90" />
          </span>
        </Link>
      </motion.header>

      {/* Table card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        aria-label="Property listings"
        className="overflow-hidden rounded-3xl bg-[#FAF9F6] shadow-[0_10px_40px_rgba(26,42,34,0.08)] ring-1 ring-[#52685B]/15"
      >
        {/* Column heads (desktop only) */}
        <div
          className={`hidden gap-4 border-b border-[#52685B]/15 bg-[#F3F0E8] px-6 py-4 lg:grid ${COLS}`}
        >
          {['Title', 'Price', 'Type', 'City', 'Availability', 'Actions'].map((h) => (
            <span key={h} className="text-[11px] uppercase tracking-[0.2em] text-[#52685B]">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center">
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="text-sm text-[#52685B]"
            >
              Loading properties...
            </motion.p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F0E8]">
              <Home className="text-[#D4A62A]" size={26} strokeWidth={1.4} />
            </span>
            <p className="mt-4 text-lg">No properties yet</p>
            <p className="mt-1 text-sm text-[#52685B]">
              Add your first listing to see it here.
            </p>
            <Link
              href="/admin/properties/add"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1A2A22] px-5 py-2.5 text-sm text-[#FAF9F6] transition hover:bg-[#52685B]"
            >
              Add Property <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <ul>
            {properties.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`grid items-center gap-x-4 gap-y-3 border-b border-[#52685B]/10 px-5 py-5 transition-colors last:border-b-0 hover:bg-[#F3F0E8]/60 sm:px-6 lg:py-4 ${COLS}`}
              >
                {/* Title */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F0E8] sm:flex">
                    <Home className="text-[#D4A62A]" size={16} strokeWidth={1.5} />
                  </span>
                  <span className="text-[15px] leading-snug">{p.title}</span>
                </div>

                {/* Price */}
                <p className="flex items-baseline justify-between gap-2 lg:block">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#52685B] lg:hidden">
                    Price
                  </span>
                  <span className="text-[15px]">₹{Number(p.price).toLocaleString('en-IN')}</span>
                </p>

                {/* Type */}
                <p className="flex items-center justify-between gap-2 lg:block">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#52685B] lg:hidden">
                    Type
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${
                      typeStyles[p.type] || typeStyles.buy
                    }`}
                  >
                    {p.type}
                  </span>
                </p>

                {/* City */}
                <p className="flex items-center justify-between gap-2 text-sm text-[#52685B] lg:justify-start">
                  <span className="text-[11px] uppercase tracking-[0.2em] lg:hidden">City</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#D4A62A]" />
                    {p.city}
                  </span>
                </p>

                {/* Availability */}
                <div className="flex items-center justify-between gap-2 lg:block">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#52685B] lg:hidden">
                    Availability
                  </span>
                  <select
                    value={p.status}
                    onChange={(e) => changeStatus(p.id, e.target.value)}
                    aria-label={`Availability for ${p.title}`}
                    className={`cursor-pointer rounded-full border-0 py-1.5 pl-3 pr-7 text-xs font-[family-name:var(--font-marcellus)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                      statusStyles[p.status] || statusStyles.active
                    }`}
                  >
                    <option value="active">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 lg:pt-0">
                  <Link
                    href={`/admin/properties/edit/${p.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1A2A22] px-4 py-2 text-xs text-[#FAF9F6] transition hover:bg-[#52685B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProperty(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F6E3DF] px-4 py-2 text-xs text-[#9C3B2B] transition hover:bg-[#EFD0CA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9C3B2B]"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}

        {properties.length > 0 && (
          <div className="border-t border-[#52685B]/15 bg-[#F3F0E8] px-6 py-3">
            <p className="text-xs text-[#52685B]">
              {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} total
            </p>
          </div>
        )}
      </motion.section>
    </div>
  );
}