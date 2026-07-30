import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  passwordStrength,
} from '../../lib/validation';
import AuthLayout from './AuthLayout';

const STRENGTH_LABEL = ['Sangat lemah', 'Lemah', 'Cukup', 'Kuat'];

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(password);
  const strengthClass = strength <= 1 ? 'filled-weak' : strength === 2 ? 'filled-mid' : 'filled-strong';

  const validate = () => {
    const errors = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) errors.password = passErr;

    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (confirmErr) errors.confirmPassword = confirmErr;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    const { data, error } = await signUp({ email, password });
    setSubmitting(false);

    if (error) {
      setFormError(
        error.message.includes('already registered')
          ? 'Email ini sudah terdaftar'
          : error.message
      );
      return;
    }

    if (!data.session) {
      setSubmitted(true);
      return;
    }

    navigate('/dashboard');
  };

  if (submitted) {
    return (
      <AuthLayout eyebrow="Daftar" title="Cek email kamu">
        <div className="auth-banner success">
          Kami sudah kirim link konfirmasi ke <b>{email}</b>. Buka email itu untuk mengaktifkan akun.
        </div>
        <Link to="/login" className="auth-link">
          Kembali ke halaman login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Daftar"
      title="Buat akun baru"
      subtitle="Akses sinyal AI Trading Analyst dan dashboard-mu."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="auth-link">
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {formError && <div className="auth-banner error">{formError}</div>}

        <div className="auth-field">
          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`auth-input ${fieldErrors.email ? 'has-error' : ''}`}
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <span className="auth-error-text">{fieldErrors.email}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={`auth-input ${fieldErrors.password ? 'has-error' : ''}`}
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <>
              <div className="auth-strength-track">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`auth-strength-bar ${i < strength ? strengthClass : ''}`} />
                ))}
              </div>
              <span className="auth-label" style={{ fontSize: '0.75rem' }}>
                {STRENGTH_LABEL[Math.max(strength - 1, 0)]}
              </span>
            </>
          )}
          {fieldErrors.password && <span className="auth-error-text">{fieldErrors.password}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmPassword">Konfirmasi password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={`auth-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {fieldErrors.confirmPassword && (
            <span className="auth-error-text">{fieldErrors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Buat akun'}
        </button>
      </form>
    </AuthLayout>
  );
}
