"use client";

export default function SettingsHeader() {
  return (
    <section>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
        Settings
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[34px] italic text-ink sm:text-[40px]">
        Account settings
      </h1>
      <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
        Manage your account, security, notifications, marketplace store and other
        preferences.
      </p>
    </section>
  );
}