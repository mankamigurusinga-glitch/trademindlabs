import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validatePassword, validateConfirmPassword } from '../../lib/validation';
import AuthLayout from './AuthLayout';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const errors = {};
    const passErr = validatePassword(password);
    if (passErr) errors.password = passErr;
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (confirmErr) errors.confirmPassword = confirmErr;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  if (done) {
    return (
      <AuthLayout eyebrow="Reset password" title="Password berhasil diubah">
        <div className="auth-banner success">Mengarahkan ke halaman login...</div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="Reset password" title="Buat password baru">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {formError && <div className="auth-banner error">{formError}</div>}

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">Password baru</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={`auth-input ${fieldErrors.password ? 'has-error' : ''}`}
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && <span className="auth-error-text">{fieldErrors.password}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmPassword">Konfirmasi password baru</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={`auth-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {fieldErrors.confirmPassword && (
            <span className="auth-error-text">{fieldErrors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? 'Menyimpan...' : 'Simpan password baru'}
        </button>
      </form>

      <Link to="/login" className="auth-link" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
        Batal
      </Link>
    </AuthLayout>
  );
}
