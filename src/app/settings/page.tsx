"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Pencil, User } from "lucide-react";
import { authService } from "../../services/authService";
import { useTranslation } from "../../i18n/useTranslation";

export default function SettingsPage() {
  const { t, locale, setLocale } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(authService.getUser());
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const [nameOpen, setNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name ?? "");

  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState(user?.email ?? "");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;

      const storedUser = authService.getUser();
      setUser(storedUser);
      setNameDraft(storedUser?.name ?? "");
      setResetEmail(storedUser?.email ?? "");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.name?.trim() || user?.email || t("accountSignedInFallback");

  const saveName = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setToast("");
    try {
      await authService.updateDisplayName(nameDraft.trim());
      setUser(authService.getUser());
      setToast(t("settingsSavedName"));
      setNameOpen(false);
    } catch {
      setToast(t("settingsCannotSaveName"));
    } finally {
      setBusy(false);
    }
  };

  const sendReset = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setToast("");
    try {
      await authService.requestPasswordReset({ email: resetEmail.trim() });
      setToast(t("loginForgotPasswordSent"));
      setResetOpen(false);
    } catch {
      setToast(t("authResetFailed"));
    } finally {
      setBusy(false);
    }
  };

  const onSignOut = () => {
    authService.signOut();
    router.replace("/login");
  };

  return (
    <main className="settings-page">
      <div className="settings-card">
        <header className="settings-header">
          <Link href="/chat" className="back">
            <ArrowLeft size={18} />
            {t("settingsBack")}
          </Link>
          <h1>{t("settingsTitle")}</h1>
        </header>

        {toast && <div className="toast">{toast}</div>}

        <section className="profile">
          <div className="avatar">
            <User size={32} />
          </div>
          <div className="profile-text">
            <h2>{displayName}</h2>
            {user?.email && <p>{user.email}</p>}
          </div>
        </section>

        <div className="actions">
          <button type="button" className="btn secondary" disabled={busy} onClick={() => setNameOpen(true)}>
            <Pencil size={16} />
            {t("settingsEditProfileDialogTitle")}
          </button>
          <button type="button" className="btn secondary" disabled={busy} onClick={() => setResetOpen(true)}>
            <Lock size={16} />
            {t("settingsResetPassword")}
          </button>
        </div>

        <section className="section">
          <h3>{t("settingsLanguageSection")}</h3>
          <div className="pills">
            <button
              type="button"
              className={locale === "si" ? "pill active" : "pill"}
              onClick={() => setLocale("si")}
            >
              {t("languageSinhala")}
            </button>
            <button
              type="button"
              className={locale === "en" ? "pill active" : "pill"}
              onClick={() => setLocale("en")}
            >
              {t("languageEnglish")}
            </button>
          </div>
        </section>

        <button type="button" className="btn danger" disabled={busy} onClick={onSignOut}>
          {t("settingsSignOut")}
        </button>
      </div>

      {nameOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => !busy && setNameOpen(false)}>
          <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{t("settingsEditProfileDialogTitle")}</h3>
            <p className="muted">{t("settingsEditNameSubtitle")}</p>
            <form onSubmit={saveName}>
              <label className="field">
                <span>{t("fieldLabelFullName")}</span>
                <input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder={t("displayNameOptionalLabel")}
                  autoFocus
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" disabled={busy} onClick={() => setNameOpen(false)}>
                  {t("dialogCancel")}
                </button>
                <button type="submit" className="btn primary" disabled={busy}>
                  {t("dialogSave")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resetOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => !busy && setResetOpen(false)}>
          <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{t("loginForgotPasswordDialogTitle")}</h3>
            <p className="muted">{t("settingsResetPasswordDialogSubtitle")}</p>
            <form onSubmit={sendReset}>
              <label className="field">
                <span>{t("fieldLabelEmailAddress")}</span>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" disabled={busy} onClick={() => setResetOpen(false)}>
                  {t("dialogCancel")}
                </button>
                <button type="submit" className="btn primary" disabled={busy}>
                  {t("dialogSend")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .settings-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 28px;
          background: radial-gradient(circle at top left, rgba(191,219,254,.45), transparent 32%),
            linear-gradient(180deg, #fff 0%, #f8fbff 100%);
          color: #0f172a;
          font-family: Inter, system-ui, sans-serif;
        }
        .settings-card {
          width: min(520px, 100%);
          background: rgba(255,255,255,.94);
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 24px 70px rgba(15,23,42,.1);
        }
        .settings-header {
          display: grid;
          gap: 10px;
          margin-bottom: 18px;
        }
        .settings-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1d4ed8;
          font-weight: 800;
          text-decoration: none;
          font-size: 14px;
        }
        .toast {
          margin-bottom: 14px;
          padding: 10px 12px;
          border-radius: 12px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          font-size: 13px;
          font-weight: 700;
        }
        .profile {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 16px;
          border-radius: 18px;
          background: rgba(239,246,255,.72);
          border: 1px solid rgba(191,219,254,.74);
          margin-bottom: 18px;
        }
        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }
        .profile-text h2 {
          margin: 0 0 4px;
          font-size: 18px;
        }
        .profile-text p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          word-break: break-word;
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 22px;
        }
        .section h3 {
          margin: 0 0 10px;
          font-size: 15px;
        }
        .pills {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .pill {
          border: 1px solid #e2e8f0;
          background: #fff;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
        }
        .pill.active {
          background: #1d4ed8;
          color: #fff;
          border-color: #1d4ed8;
        }
        .btn {
          border: 0;
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 900;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn:disabled {
          opacity: .65;
          cursor: not-allowed;
        }
        .btn.secondary {
          background: rgba(248,250,252,.95);
          border: 1px solid rgba(226,232,240,.95);
          color: #0f172a;
        }
        .btn.primary {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
        }
        .btn.ghost {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #0f172a;
        }
        .btn.danger {
          width: 100%;
          background: #dc2626;
          color: #fff;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,.45);
          display: grid;
          place-items: center;
          padding: 18px;
          z-index: 50;
        }
        .modal {
          width: min(440px, 100%);
          background: #fff;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 24px 70px rgba(15,23,42,.18);
        }
        .modal h3 {
          margin: 0 0 6px;
        }
        .muted {
          margin: 0 0 14px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }
        .field {
          display: grid;
          gap: 8px;
          margin-bottom: 12px;
        }
        .field span {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #475569;
        }
        .field input {
          height: 44px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 0 12px;
          font: inherit;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }
      `}</style>
    </main>
  );
}
