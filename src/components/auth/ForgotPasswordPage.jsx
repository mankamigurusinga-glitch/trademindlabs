import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../lib/validation';
import AuthLayout from './AuthLayout';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const emailErr = validateEmail(email);
    if (emailErr) {
      setFieldError(emailErr);
      return;
    }
    setFieldError(null);
    setSubmitting(true);
    const { error } = await sendPasswordReset(email);
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout eyebrow="Lupa password" title="Link sudah dikirim">
        <div className="auth-banner success">
          Kalau <b>{email}</b> terdaftar, kami sudah kirim link untuk reset password ke email itu.
        </div>
        <Link to="/login" className="auth-link">
          Kembali ke halaman login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Lupa password"
      title="Reset password kamu"
      subtitle="Masukkan email yang terdaftar, kami kirimkan link untuk buat password baru."
      footer={
        <Link to="/login" className="auth-link">
          Kembali ke halaman login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {error && <div className="auth-banner error">{error}</div>}
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`auth-input ${fieldError ? 'has-error' : ''}`}
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldError && <span className="auth-error-text">{fieldError}</span>}
        </div>
        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? 'Mengirim...' : 'Kirim link reset'}
        </button>
      </form>
    </AuthLayout>
  );
}
