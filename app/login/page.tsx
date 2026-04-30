/*
File: app/login/page.tsx
Version: CINENTO Login PRO v2.0
Updated: 2026-04-30 [Europe/Istanbul]
Status: Secure Login via API + ENV
*/

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@cinento.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
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
      } else {
        alert(data.message || "Invalid login credentials.");
      }
    } catch {
      alert("Login failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md p-8 border border-neutral-800 rounded-2xl bg-neutral-950">
        <p className="text-yellow-500 tracking-[0.3em] text-sm mb-3">
          CINENTO
        </p>

        <h1 className="text-3xl font-bold mb-6 text-yellow-500">
          CINENTO Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 bg-white text-black border border-neutral-700 rounded focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 bg-white text-black border border-neutral-700 rounded focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-3 rounded font-bold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </div>
    </main>
  );
}