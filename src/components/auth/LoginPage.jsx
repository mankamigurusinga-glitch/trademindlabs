import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../lib/validation';
import AuthLayout from './AuthLayout';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;
    if (!password) errors.password = 'Password wajib diisi';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await signIn({ email, password });
    setSubmitting(false);

    if (error) {
      setFormError(
        error.message === 'Invalid login credentials'
          ? 'Email atau password salah'
          : error.message
      );
      return;
    }

    navigate('/dashboard');
  };

  return (
    <AuthLayout
      eyebrow="Masuk"
      title="Selamat datang kembali"
      subtitle="Masuk untuk melihat sinyal dan analisis terbaru."
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="auth-link">
            Daftar
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label className="auth-label" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: '0.8rem' }}>
              Lupa password?
            </Link>
          </div>
          <div className="auth-input-row">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`auth-input ${fieldErrors.password ? 'has-error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: '3.2rem' }}
            />
            <button
              type="button"
              className="auth-toggle-visibility"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? 'SEMBUNYIKAN' : 'LIHAT'}
            </button>
          </div>
          {fieldErrors.password && <span className="auth-error-text">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </AuthLayout>
  );
}
