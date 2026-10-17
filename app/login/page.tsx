"use client";

import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();
      if (response.ok && result.success === true) {
        window.location.assign("/en/dashboard");
        return;
      }
      setError(result.message || "Sign-in failed.");
    } catch { setError("Unable to connect. Try again."); }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <form onSubmit={login} className="w-full max-w-md p-8 border border-neutral-800 rounded-2xl bg-neutral-950">
        <p className="text-yellow-500 tracking-[0.3em] text-sm mb-3">CINENTO</p>
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Administrator Login</h1>
        <p className="text-sm text-gray-400 mb-6">Preview access: view the existing dashboard. Saving, uploading, deleting and CRM access are disabled.</p>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required maxLength={320}
          className="w-full mb-4 mt-2 p-3 bg-white text-black rounded" value={email} onChange={event => setEmail(event.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={1024}
          className="w-full mb-6 mt-2 p-3 bg-white text-black rounded" value={password} onChange={event => setPassword(event.target.value)} />
        {error && <p role="alert" className="text-red-300 mb-4">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black py-3 rounded font-bold disabled:opacity-60">
          {loading ? "Checking…" : "Login"}
        </button>
      </form>
    </main>
  );
}
