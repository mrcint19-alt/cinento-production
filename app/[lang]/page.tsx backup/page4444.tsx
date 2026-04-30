/* 
Version: v3.2
Status: FULL FILE (NO SIMPLIFICATION) + CRM CONNECTED
*/

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HomePage() {
  const params = useParams();
  const router = useRouter();

  const lang = params?.lang === "tr" ? "tr" : "en";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setLoading(false);
        return;
      }

      alert("Saved");

      setName("");
      setEmail("");
      setMessage("");
    } catch {
      alert("Error");
    }

    setLoading(false);
  }

  return (
    <main className="bg-[#070707] text-white min-h-screen">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            From Idea to International Film Market
          </h1>

          <p className="mt-6 text-neutral-400">
            CINENTO connects storytelling, financing, and distribution.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => scrollTo("contact")}
              className="bg-[#d4af37] text-black px-6 py-3 rounded-xl"
            >
              Start Project
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-2xl border border-yellow-500/20">
          CINENTO
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-20">

        <div className="bg-neutral-900 p-10 rounded-3xl border border-yellow-500/20">

          <h2 className="text-3xl text-yellow-500 mb-6">
            Start Your Project
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-3 bg-black border border-yellow-500/20 rounded-xl"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 bg-black border border-yellow-500/20 rounded-xl"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="w-full p-3 bg-black border border-yellow-500/20 rounded-xl"
            />

            <button
              disabled={loading}
              className="w-full bg-[#d4af37] text-black py-3 rounded-xl"
            >
              {loading ? "..." : "Submit"}
            </button>

          </form>
        </div>

      </section>

    </main>
  );
}