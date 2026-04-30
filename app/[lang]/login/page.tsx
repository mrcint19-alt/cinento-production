/*
File: app/[lang]/login/page.tsx
Version: CINENTO Login PRO v2.1
Updated: 2026-04-30 [Europe/Istanbul]
Status: Secure Login via API + ENV + Dashboard Redirect
*/

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@cinento.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("cinento_auth", "true");
        router.push("/en/dashboard");
        return;
      }

      alert(data.message || "Invalid login credentials.");
    } catch {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/90 p-8 shadow-2xl">
        <p className="mb-3 text-sm tracking-[0.3em] text-yellow-500">
          CINENTO
        </p>

        <h1 className="mb-6 text-3xl font-bold text-yellow-500">
          CINENTO Login
        </h1>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-yellow-500 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </div>
      </div>
    </main>
  );
}