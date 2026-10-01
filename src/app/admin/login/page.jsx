'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut, getSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';


export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setLoading(false);
      setError('Email or password might be wrong. Please try again.');
      return;
    }

    const session = await getSession();

    if (session?.user?.role?.toLowerCase() !== 'admin') {
      await signOut({ redirect: false });
      setLoading(false);
      setError('Only admin can sign in here.');
      return;
    }

    setLoading(false);
    router.push('/admin');
  };
  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; overflow: hidden; }
        .login-input {
          width: 100%;
          padding: 9px 14px 9px 38px;
          border: 1.5px solid #e8e3d3;
          border-radius: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          color: #1a2a22;
          background: #faf9f6;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .login-input:focus {
          border-color: #e2a10d;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(255,205,57,0.2);
        }
        .login-input::placeholder { color: rgba(82,104,91,0.55); }
        .login-btn {
          width: 100%;
          padding: 11px;
          background: #1a2a22;
          color: #faf9f6;
          border: 1px solid rgba(226,161,13,0.5);
          border-radius: 13px;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
        }
        .login-btn:hover:not(:disabled) {
          background: #52685B;
          box-shadow: 0 6px 20px rgba(26,42,34,0.28);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.985);
          box-shadow: none;
        }
        .login-btn:disabled {
          background: #52685B;
          opacity: 0.7;
          cursor: not-allowed;
        }
        .forgot-link {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #52685B;
          text-decoration: none;
          margin-top: 5px;
          font-weight: 500;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .forgot-link:hover { opacity: 1; }
        .signup-link {
          color: #1a2a22;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1.5px solid transparent;
          transition: border-color 0.2s;
        }
        .signup-link:hover { border-color: #e2a10d; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,205,57,0.35);
          border-top-color: #ffcd39;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto;
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(14px); }
        }
        .bg-circle-1 {
          position: absolute; width: 400px; height: 400px;
          border-radius: 50%; background: rgba(255,205,57,0.12);
          top: -100px; right: -100px;
          animation: floatA 8s ease-in-out infinite;
        }
        .bg-circle-2 {
          position: absolute; width: 280px; height: 280px;
          border-radius: 50%; background: rgba(226,161,13,0.09);
          bottom: -60px; left: -60px;
          animation: floatB 10s ease-in-out infinite;
        }
        .bg-circle-3 {
          position: absolute; width: 180px; height: 180px;
          border-radius: 50%; background: rgba(82,104,91,0.08);
          top: 40%; left: 8%;
          animation: floatA 12s ease-in-out infinite 2s;
        }
      `}</style>

      <div style={{
        height: '100dvh',
        background: '#faf9f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Jost', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="bg-circle-1" />
        <div className="bg-circle-2" />
        <div className="bg-circle-3" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid #e8e3d3',
            boxShadow: '0 30px 60px -35px rgba(26,42,34,0.35)',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Dark Header */}
          <div style={{
            background: '#1a2a22',
            padding: '1.3rem 1.8rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            {/* Top gold hairline */}
            <span aria-hidden="true" style={{
              position: 'absolute', left: 0, right: 0, top: 0, height: 2,
              background: 'linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)',
            }} />
            <div style={{
              position: 'absolute', width: 200, height: 200,
              borderRadius: '50%', background: 'rgba(255,205,57,0.08)',
              top: -70, right: -50,
            }} />
            <div style={{
              position: 'absolute', width: 120, height: 120,
              borderRadius: '50%', background: 'rgba(255,205,57,0.05)',
              bottom: -30, left: 30,
            }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
              style={{
                width: 44, height: 44,
                flexShrink: 0,
                background: 'rgba(255,205,57,0.1)',
                border: '1px solid rgba(226,161,13,0.55)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffcd39">
                <path d="M17 8C8 10 5.9 16.17 3.82 21h1.93c.55-1.53 1.34-3.08 2.54-4.38C9.95 14.71 13.2 13 17 13v3.38l5-5L17 6v2z" />
              </svg>
            </motion.div>

            <div style={{ position: 'relative' }}>
              <motion.h1
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{
                  fontFamily: "'Marcellus', serif",
                  color: '#faf9f6',
                  fontSize: 24,
                  fontWeight: 400,
                  letterSpacing: '0.3px',
                  margin: 0,
                }}
              >
                Welcome Back
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  color: 'rgba(243,240,232,0.7)',
                  fontSize: 13,
                  fontWeight: 300,
                  marginTop: 2,
                  marginBottom: 0,
                }}
              >
                Sign in to continue your journey
              </motion.p>
            </div>
          </div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ padding: '1.4rem 1.8rem 1.4rem' }}
          >
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: '#fff5f5',
                    border: '1px solid #fca5a5',
                    borderLeft: '3px solid #ef4444',
                    borderRadius: 10,
                    padding: '8px 12px',
                    marginBottom: '0.9rem',
                    fontSize: 13,
                    color: '#b91c1c',
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: '#52685B',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && document.getElementById('pass-input')?.focus()}
                />
                <svg
                  viewBox="0 0 24 24" width="16" height="16"
                  fill="none" stroke="#e2a10d" strokeWidth="1.8"
                  style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '0.3rem' }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: '#52685B',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="pass-input"
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <svg
                  viewBox="0 0 24 24" width="16" height="16"
                  fill="none" stroke="#e2a10d" strokeWidth="1.8"
                  style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              {/* <a href="/forgot-password" className="forgot-link">Forgot password?</a> */}
            </div>

            {/* Submit Button */}
            <motion.button
              className="login-btn"
              onClick={handleSubmit}
              disabled={loading}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              style={{ marginTop: '1.1rem' }}
            >
              {loading ? <div className="spinner" /> : 'Sign In'}
            </motion.button>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              margin: '1rem 0 0.8rem',
            }}>
              <div style={{ flex: 1, height: 1, background: '#e8e3d3' }} />
              <span style={{ fontSize: 12, color: '#52685B', whiteSpace: 'nowrap' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e8e3d3' }} />
            </div>

            {/* Sign Up */}
            <p style={{ textAlign: 'center', fontSize: 13.5, color: '#52685B', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <a href="/admin/signup" className="signup-link">Create one</a>            </p>

            {/* Decorative dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: '0.9rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(226,161,13,0.3)', display: 'block' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffcd39', display: 'block' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(226,161,13,0.3)', display: 'block' }} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}