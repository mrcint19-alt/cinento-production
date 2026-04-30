"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 🔐 نسخه ساده (فعلاً)
    if (email === "admin@cinento.com" && password === "123456") {
      localStorage.setItem("cinento_auth", "true");
      router.push("/en/dashboard");
    } else {
      alert("Wrong credentials");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-yellow-500">
          CINENTO Login
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 bg-neutral-900 border rounded"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 bg-neutral-900 border rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-500 text-black py-3 rounded font-bold"
        >
          Login
        </button>
      </div>
    </main>
  );
}