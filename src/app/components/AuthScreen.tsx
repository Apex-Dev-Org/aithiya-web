"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { authService } from "../../services/authService";

type AuthScreenProps = {
  initialMode?: "login" | "signup";
  gateMessage?: string;
  onAuthenticated?: () => void;
};

export default function AuthScreen({
  initialMode = "login",
  gateMessage,
  onAuthenticated,
}: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordScore = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "forgot") {
      if (!form.email.trim()) {
        setError("Please enter your email address.");
        return;
      }

      setLoading(true);
      try {
        await authService.requestPasswordReset({ email: form.email });
        setSuccess("Reset link sent. Please check your email inbox.");
      } catch {
        setError("Unable to send the reset email. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "signup" && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await authService.register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        await authService.login({
          email: form.email,
          password: form.password,
        });
      }

      if (onAuthenticated) {
        onAuthenticated();
      } else {
        window.location.href = "/chat";
      }
    } catch {
      setError("Unable to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-visual">
          <Link href="/" className="auth-home-logo">
            <img src="/aythiya_logo.png" alt="Aythiya" />
          </Link>
          <img
            className="auth-hero-image"
            src="/how_aythiya_works_bg.png"
            alt="Lotus Tower skyline"
          />
        </div>

        <form className="auth-card" onSubmit={submit}>
          <div className="auth-logo">
            <img src="/aythiya_logo.png" alt="Aythiya" />
          </div>

          {gateMessage && <div className="gate-message">{gateMessage}</div>}

          <div className="auth-switch">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccess("");
              }}
            >
              Create account
            </button>
          </div>

          <div className="auth-heading">
            <h2>
              {mode === "login"
                ? "Welcome back"
                : mode === "forgot"
                  ? "Reset password"
                  : "Create Account"}
            </h2>
            <p>
              {mode === "login"
                ? "Ask any legal question with your secure Aythiya account."
                : mode === "forgot"
                  ? "Enter your email and we’ll send a secure password reset link."
                : "Create your secure Aythiya account to start chatting."}
            </p>
          </div>

          {mode === "signup" && (
            <AuthField
              icon={<User size={17} />}
              label="Name"
              value={form.name}
              placeholder="Your full name"
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            />
          )}

          <AuthField
            icon={<Mail size={17} />}
            label="Email address"
            value={form.email}
            placeholder="name@example.com"
            type="email"
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
          />

          {mode !== "forgot" && (
            <AuthField
              icon={<Lock size={17} />}
              label="Password"
              value={form.password}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
            />
          )}

          {mode === "signup" && (
            <>
              <div className="password-meter" aria-label="Password strength">
                {[0, 1, 2, 3].map((item) => (
                  <span key={item} className={item < passwordScore ? "on" : ""} />
                ))}
              </div>
              <AuthField
                icon={<Lock size={17} />}
                label="Confirm password"
                value={form.confirmPassword}
                placeholder="••••••••"
                type="password"
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, confirmPassword: value }))
                }
              />
            </>
          )}

          {mode === "login" && (
            <div className="forgot-row">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setSuccess("");
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? mode === "forgot"
                ? "Sending reset link..."
                : "Authenticating..."
              : mode === "forgot"
                ? "Send reset link"
              : mode === "login"
                ? "Sign in"
                : "Create Account"}
            <ArrowRight size={18} />
          </button>

          <div className="auth-divider">
            <span />
            or
            <span />
          </div>

          <button
            className="google-btn"
            type="button"
            onClick={() => setError("Google sign-in will be connected later.")}
          >
            <span>G</span>
            {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
          </button>

          <p className="auth-bottom">
            {mode === "login"
              ? "Don’t have an account?"
              : mode === "forgot"
                ? "Remember your password?"
                : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setSuccess("");
              }}
            >
              {mode === "login" ? "Create Account" : "Sign in"}
            </button>
          </p>

          <div className="auth-trust">
            <span>Private</span>
            <span>Confidential</span>
            <span>AI-powered guidance</span>
          </div>
        </form>
      </section>

      <style>{`
        .auth-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 48px;
          background: #fff;
          font-family: Inter, sans-serif;
          color: #0f172a;
        }

        .auth-shell {
          position: relative;
          z-index: 1;
          width: min(1320px, 100%);
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) 430px;
          gap: 34px;
          align-items: center;
        }

        .auth-visual {
          min-height: 560px;
          position: relative;
          display: grid;
          place-items: center start;
          overflow: visible;
        }

        .auth-home-logo img {
          position: absolute;
          top: 10px;
          left: 0;
          width: 92px;
          height: auto;
          z-index: 2;
        }

        .auth-hero-image {
          width: min(880px, 118%);
          height: auto;
          object-fit: contain;
          opacity: .96;
          animation: authFloatBg 10s ease-in-out infinite alternate;
          filter: none;
          transform: translateX(-72px);
        }

        .gate-message {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 12px;
          color: #1d4ed8;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          font-size: 12px;
          font-weight: 800;
        }

        .auth-card {
          padding: 34px;
          border-radius: 28px;
          background: #fff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 24px 70px rgba(15,23,42,.10);
          animation: authReveal .8s ease both;
        }

        .auth-logo {
          text-align: center;
          margin-bottom: 16px;
        }

        .auth-logo img {
          width: 128px;
          height: auto;
        }

        .gate-message {
          margin-bottom: 14px;
        }

        .auth-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          padding: 6px;
          border-radius: 16px;
          background: #eff6ff;
          margin-bottom: 22px;
        }

        .auth-switch button {
          border: 0;
          border-radius: 12px;
          padding: 11px;
          color: #64748b;
          background: transparent;
          font-weight: 900;
          cursor: pointer;
        }

        .auth-switch button.active {
          color: #1d4ed8;
          background: #fff;
          box-shadow: 0 8px 20px rgba(29,78,216,.1);
        }

        .auth-heading {
          text-align: center;
          margin-bottom: 22px;
        }

        .auth-heading h2 {
          font-size: 28px;
          margin-bottom: 7px;
        }

        .auth-heading p {
          color: #94a3b8;
          font-size: 14px;
        }

        .auth-field {
          margin-bottom: 14px;
        }

        .auth-field label {
          display: block;
          color: #475569;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .field-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          height: 48px;
          border-radius: 14px;
          background: rgba(248,250,252,.9);
          border: 1px solid rgba(226,232,240,.9);
          transition: border-color .2s, box-shadow .2s, background .2s;
        }

        .field-box:focus-within {
          border-color: #93c5fd;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(147,197,253,.22);
        }

        .field-box svg {
          color: #94a3b8;
        }

        .field-box input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: #0f172a;
          font: inherit;
          font-size: 14px;
        }

        .field-box button {
          border: 0;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .password-meter {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          margin: -3px 0 12px;
        }

        .password-meter span {
          height: 4px;
          border-radius: 99px;
          background: #e2e8f0;
        }

        .password-meter span.on {
          background: #2563eb;
        }

        .forgot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 4px 0 16px;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .forgot-row label {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .forgot-row button {
          color: #0f172a;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-weight: 900;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 11px;
        }

        .auth-error {
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          padding: 9px 12px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .auth-success {
          color: #166534;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 9px 12px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .auth-submit,
        .google-btn {
          width: 100%;
          height: 48px;
          border-radius: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s, background .2s;
        }

        .auth-submit {
          border: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #fff;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          box-shadow: 0 14px 30px rgba(29,78,216,.24);
        }

        .auth-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(29,78,216,.32);
        }

        .auth-submit:disabled {
          opacity: .72;
          cursor: not-allowed;
          transform: none;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #cbd5e1;
          font-size: 12px;
          margin: 18px 0;
        }

        .auth-divider span {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .google-btn {
          border: 1px solid #cbd5e1;
          color: #0f172a;
          background: #fff;
        }

        .google-btn span {
          color: #2563eb;
          margin-right: 9px;
          font-weight: 900;
        }

        .auth-bottom {
          margin: 18px 0 0;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
        }

        .auth-bottom button {
          border: 0;
          background: transparent;
          color: #1d4ed8;
          cursor: pointer;
          font-weight: 900;
        }

        .auth-trust {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 18px;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
        }

        .auth-trust span::before {
          content: "•";
          color: #1d4ed8;
          margin-right: 7px;
        }

        @keyframes authReveal {
          from { opacity: 0; transform: translateY(18px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes authFloatBg {
          from { transform: translateX(-72px) translateY(0) scale(1.08); }
          to { transform: translateX(-72px) translateY(-8px) scale(1.1); }
        }

        @media(max-width: 980px) {
          .auth-page { padding: 22px; }
          .auth-shell { grid-template-columns: 1fr; }
          .auth-visual { min-height: 260px; }
          .auth-home-logo img { position: static; margin-bottom: 14px; }
          .auth-hero-image {
            width: min(720px, 100%);
            transform: none;
          }
          @keyframes authFloatBg {
            from { transform: translateY(0) scale(1); }
            to { transform: translateY(-6px) scale(1.02); }
          }
        }

        @media(max-width: 560px) {
          .auth-page { padding: 0; }
          .auth-shell { width: 100%; gap: 0; }
          .auth-visual { display: none; }
          .auth-card { min-height: 100vh; border-radius: 0; padding: 28px 20px; }
        }
      `}</style>
    </main>
  );
}

function AuthField({
  label,
  value,
  placeholder,
  icon,
  rightIcon,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="auth-field">
      <label>{label}</label>
      <div className="field-box">
        {icon}
        <input
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {rightIcon}
      </div>
    </div>
  );
}
