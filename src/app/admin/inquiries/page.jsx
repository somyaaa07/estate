'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Marcellus } from 'next/font/google';
import {
  ArrowRight,
  Calendar,
  Inbox,
  Mail,
  MapPin,
  Phone,
  Trash2,
  X,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

/* ---------------------------------------------------------------
   COLORS (same system as About page)
   Primary  : #1A2A22
   Secondary: #52685B
   BG       : #FAF9F6  &  #F3F0E8
   Gold     : #D4AF37 / #D4A62A / #F5D77A
---------------------------------------------------------------- */

const STATUS_CONFIG = {
  new: {
    label: 'New',
    badge: 'bg-[#D4AF37]/15 text-[#8A6A12]',
    dot: 'bg-[#D4A62A]',
    active: 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#8A6A12]',
  },
  read: {
    label: 'Read',
    badge: 'bg-[#52685B]/10 text-[#52685B]',
    dot: 'bg-[#52685B]',
    active: 'border-[#52685B] bg-[#52685B]/10 text-[#52685B]',
  },
  replied: {
    label: 'Replied',
    badge: 'bg-[#1A2A22] text-[#FAF9F6]',
    dot: 'bg-[#F5D77A]',
    active: 'border-[#1A2A22] bg-[#1A2A22] text-[#FAF9F6]',
  },
};

const FILTERS = [
  { key: 'all', label: 'Total Inquiries' },
  { key: 'new', label: 'New' },
  { key: 'read', label: 'Read' },
  { key: 'replied', label: 'Replied' },
];

/* ---------------------------------------------------------------
   SMALL REUSABLE PIECES
---------------------------------------------------------------- */
const Eyebrow = ({ children, line = false }) => (
  <p className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.25em] text-[#52685B]">
    {children}
    {line && <span className="h-px w-12 bg-[#52685B]/40" />}
  </p>
);

const StatusBadge = ({ status }) => {
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] ${sc.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
      {sc.label}
    </span>
  );
};

const Initial = ({ name }) => (
  <span
    aria-hidden="true"
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A2A22] text-sm text-[#F5D77A] ring-1 ring-[#D4AF37]/40"
  >
    {(name || '?').trim().charAt(0).toUpperCase()}
  </span>
);

const PanelLabel = ({ children }) => (
  <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-[#52685B]">
    {children}
  </p>
);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/* ---------------------------------------------------------------
   PAGE
---------------------------------------------------------------- */
export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  // Derived from list so status changes always stay in sync
  const selected = inquiries.find((i) => i.id === selectedId) || null;

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Status update
  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Status update failed');
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
    } catch (err) {
      console.error('Update error:', err);
      alert('Could not update the status. Please try again.');
    }
    setUpdating(null);
  };

  // Delete
  const deleteInquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Could not delete the inquiry. Please try again.');
    }
  };

  // Filter + stats
  const filtered = inquiries.filter(
    (i) => filter === 'all' || i.status === filter
  );

  const stats = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    read: inquiries.filter((i) => i.status === 'read').length,
    replied: inquiries.filter((i) => i.status === 'replied').length,
  };

  return (
    <div
      className={`${marcellus.variable} font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22]`}
    >
      {/* ============ HEADER ============ */}
      <header className="mb-8">
        <Eyebrow line>Admin Panel</Eyebrow>
        <h1 className="mt-3 text-4xl font-normal leading-tight sm:text-5xl">
          Inquiries
        </h1>
        <p className="mt-2 text-sm text-[#52685B]">
          {stats.all} total, {stats.new} waiting for a reply
        </p>
      </header>

      {/* ============ STATS BAR / FILTERS ============ */}
      <section aria-label="Filter inquiries by status" className="mb-8">
        <div className="grid grid-cols-2 gap-2 rounded-3xl bg-[#F3F0E8] p-2 shadow-[0_10px_40px_rgba(26,42,34,0.08)] lg:grid-cols-4">
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`flex flex-col items-center rounded-2xl px-4 py-5 text-center transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                  active
                    ? 'bg-[#1A2A22] text-[#FAF9F6] ring-1 ring-[#D4AF37]/40'
                    : 'text-[#1A2A22] hover:bg-[#FAF9F6]'
                }`}
              >
                <span
                  className={`text-3xl leading-none ${
                    active ? 'text-[#F5D77A]' : 'text-[#1A2A22]'
                  }`}
                >
                  {stats[key]}
                </span>
                <span
                  className={`mt-2 text-xs ${
                    active ? 'text-[#FAF9F6]/80' : 'text-[#52685B]'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ TABLE + DETAIL ============ */}
      <div
        className={`grid items-start gap-6 ${
          selected ? 'xl:grid-cols-[1fr_400px]' : ''
        }`}
      >
        {/* ---------- Table ---------- */}
        <section
          aria-label="Inquiry list"
          className="overflow-hidden rounded-3xl bg-[#FAF9F6] shadow-[0_8px_30px_rgba(26,42,34,0.06)] ring-1 ring-[#52685B]/15"
        >
          {loading ? (
            <div className="px-6 py-20 text-center text-sm text-[#52685B]">
              Loading inquiries...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-20 text-center">
              <Inbox
                className="text-[#D4A62A]"
                size={34}
                strokeWidth={1.4}
              />
              <p className="mt-4 text-xl">No inquiries found</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#52685B]">
                {filter === 'all'
                  ? 'New messages from your website will appear here.'
                  : 'Nothing matches this status. Try another filter.'}
              </p>
              {filter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className="mt-5 rounded-full bg-[#1A2A22] px-6 py-2.5 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#52685B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  Show all inquiries
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F3F0E8]">
                    {[
                      ['Sender', ''],
                      ['Property', 'hidden md:table-cell'],
                      ['Status', ''],
                      ['Date', 'hidden sm:table-cell'],
                      ['', ''],
                    ].map(([h, cls], idx) => (
                      <th
                        key={idx}
                        scope="col"
                        className={`px-5 py-4 text-[11px] font-normal uppercase tracking-[0.25em] text-[#52685B] ${cls}`}
                      >
                        {h || <span className="sr-only">Actions</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inq) => {
                    const isSelected = selectedId === inq.id;
                    return (
                      <tr
                        key={inq.id}
                        tabIndex={0}
                        aria-selected={isSelected}
                        onClick={() =>
                          setSelectedId(isSelected ? null : inq.id)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedId(isSelected ? null : inq.id);
                          }
                        }}
                        className={`cursor-pointer border-t border-[#52685B]/15 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#D4AF37] ${
                          isSelected
                            ? 'bg-[#F3F0E8] shadow-[inset_3px_0_0_#D4AF37]'
                            : 'hover:bg-[#F3F0E8]/60'
                        }`}
                      >
                        {/* Sender */}
                        <td className="px-5 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Initial name={inq.name} />
                            <div className="min-w-0">
                              <p className="truncate text-sm">{inq.name}</p>
                              <p className="truncate text-xs text-[#52685B]">
                                {inq.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Property */}
                        <td className="hidden px-5 py-4 align-middle md:table-cell">
                          {inq.property ? (
                            <div className="flex items-center gap-3">
                              {inq.property.images?.[0]?.url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={inq.property.images[0].url}
                                  alt=""
                                  className="h-9 w-11 shrink-0 rounded-lg object-cover"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="max-w-[200px] truncate text-sm">
                                  {inq.property.title}
                                </p>
                                <p className="text-xs text-[#52685B]">
                                  {inq.property.city}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-[#52685B]">
                              General inquiry
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 align-middle">
                          <StatusBadge status={inq.status} />
                        </td>

                        {/* Date */}
                        <td className="hidden whitespace-nowrap px-5 py-4 align-middle text-xs text-[#52685B] sm:table-cell">
                          {formatDate(inq.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right align-middle">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteInquiry(inq.id);
                            }}
                            aria-label={`Delete inquiry from ${inq.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#9B3B2E] ring-1 ring-[#9B3B2E]/25 transition hover:bg-[#9B3B2E] hover:text-[#FAF9F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                          >
                            <Trash2 size={15} strokeWidth={1.6} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ---------- Detail Panel ---------- */}
        {selected && (
          <aside
            aria-label="Inquiry detail"
            className="rounded-3xl bg-[#FAF9F6] p-6 shadow-[0_20px_50px_rgba(26,42,34,0.12)] ring-1 ring-[#52685B]/15 xl:sticky xl:top-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow>Inquiry Detail</Eyebrow>
                <h2 className="mt-2 text-2xl font-normal leading-tight">
                  {selected.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close detail panel"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F0E8] text-[#52685B] transition hover:bg-[#1A2A22] hover:text-[#FAF9F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-[#52685B]">
              <Calendar size={13} className="text-[#D4A62A]" />
              {formatDateTime(selected.created_at)}
            </div>

            {/* Sender */}
            <div className="mt-6 rounded-2xl bg-[#F3F0E8] p-4">
              <PanelLabel>Sender</PanelLabel>
              <dl className="space-y-2.5 text-sm">
                {[
                  { label: 'Name', value: selected.name },
                  { label: 'Email', value: selected.email },
                  { label: 'Phone', value: selected.phone || 'N/A' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-xs text-[#52685B]">{f.label}</dt>
                    <dd className="break-all text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Property */}
            {selected.property && (
              <div className="mt-4 rounded-2xl bg-[#F3F0E8] p-4">
                <PanelLabel>Property</PanelLabel>
                {selected.property.images?.[0]?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.property.images[0].url}
                    alt=""
                    className="mb-3 h-32 w-full rounded-xl object-cover"
                  />
                )}
                <p className="text-lg leading-snug">
                  {selected.property.title}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-[#52685B]">
                  <MapPin size={13} className="shrink-0 text-[#D4A62A]" />
                  {selected.property.location}, {selected.property.city}
                </p>
                <p className="mt-3 text-xl text-[#1A2A22]">
                  ₹{Number(selected.property.price).toLocaleString('en-IN')}
                </p>
                <Link
                  href={`/properties/${selected.property.id}`}
                  target="_blank"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-[#1A2A22] underline decoration-[#D4AF37] decoration-1 underline-offset-4 transition hover:text-[#52685B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  View property <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Message (dark card, same as Vision / Mission block) */}
            <div className="mt-4 rounded-2xl bg-[#1A2A22] p-5 text-[#FAF9F6]">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-[#FAF9F6]/70">
                Message
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#FAF9F6]/90">
                &ldquo;{selected.message}&rdquo;
              </p>
            </div>

            {/* Status update */}
            <div className="mt-6">
              <PanelLabel>Update Status</PanelLabel>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, sc]) => {
                  const isActive = selected.status === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateStatus(selected.id, key)}
                      disabled={updating === selected.id}
                      aria-pressed={isActive}
                      className={`rounded-full border px-3 py-2 text-xs transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                        isActive
                          ? sc.active
                          : 'border-[#52685B]/25 bg-[#FAF9F6] text-[#52685B] hover:border-[#52685B]'
                      }`}
                    >
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Primary: golden fill slides in on hover (same as BtnDark) */}
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  `Re: ${selected.property?.title || 'Your Inquiry'}`
                )}`}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2 pl-5 pr-2 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="relative z-10">Send Email</span>
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
                  <Mail size={14} />
                </span>
              </a>

              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F3F0E8] px-5 py-3 text-sm text-[#1A2A22] ring-1 ring-[#52685B]/25 transition hover:bg-[#52685B] hover:text-[#FAF9F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  <Phone size={15} /> Call
                </a>
              )}

              <button
                type="button"
                onClick={() => deleteInquiry(selected.id)}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-[#9B3B2E] ring-1 ring-[#9B3B2E]/30 transition hover:bg-[#9B3B2E] hover:text-[#FAF9F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}