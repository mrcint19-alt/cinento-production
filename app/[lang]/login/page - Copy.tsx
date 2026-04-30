"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const lang = (params?.lang as string) || "en";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/${lang}/dashboard`);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-xl border border-gray-700 bg-[#0f0f0f] p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center text-[#bfa46f]">
          CINENTO Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-gray-600 bg-white text-black px-4 py-3 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-gray-600 bg-white text-black px-4 py-3 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-[#bfa46f] py-3 text-black font-semibold hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}