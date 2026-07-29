import './auth.css';

const TICKER_SYMBOLS = [
  { sym: 'BTC', chg: '+1.14%', up: true },
  { sym: 'ETH', chg: '+0.74%', up: true },
  { sym: 'DOGE', chg: '-1.21%', up: false },
  { sym: 'LINK', chg: '-0.95%', up: false },
  { sym: 'ADA', chg: '+1.30%', up: true },
  { sym: 'SUI', chg: '-0.51%', up: false },
  { sym: 'LTC', chg: '-1.18%', up: false },
  { sym: 'AVAX', chg: '-0.55%', up: false },
];

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  const loopedSymbols = [...TICKER_SYMBOLS, ...TICKER_SYMBOLS];

  return (
    <div className="auth-shell">
      <div className="auth-ticker" aria-hidden="true">
        <div className="auth-ticker-track">
          {loopedSymbols.map((t, i) => (
            <span key={i} className={`auth-ticker-item ${t.up ? 'is-up' : 'is-down'}`}>
              {t.sym} <b>{t.chg}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-brandmark">
            <span className="auth-brandmark-dot" />
            AI Crypto Futures Platform
          </div>

          {eyebrow && <p className="auth-eyebrow">{eyebrow}</p>}
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}

          <div className="auth-body">{children}</div>

          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
