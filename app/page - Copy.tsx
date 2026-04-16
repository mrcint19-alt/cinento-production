"use client";

import { useState } from "react";

type LeadStatus = "New" | "In Review" | "Contacted" | "Closed";
type LeadTemperature = "Hot" | "Warm" | "Cold";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
};

type ModuleItem = {
  title: string;
  description: string;
  href: string;
};

type JournalItem = {
  title: string;
  description: string;
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "New",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featuredModules: ModuleItem[] = [
    {
      title: "CINENTO AI Studio",
      description:
        "Creative development tools for screenplay generation, story architecture, and cinematic packaging.",
      href: "http://studio.cinento.net",
    },
    {
      title: "Outreach CRM",
      description:
        "Lead capture, contact organization, and business follow-up for partnerships and project growth.",
      href: "http://crm.cinento.net",
    },
    {
      title: "CINENTO Academy",
      description:
        "Training, workshops, and structured professional development for emerging and advanced creators.",
      href: "/academy",
    },
    {
      title: "CINENTO TV",
      description:
        "A future-facing distribution layer for showcasing projects, catalogs, and curated screen content.",
      href: "/tv",
    },
  ];

  const journalItems: JournalItem[] = [
    {
      title: "Why strong film projects fail before reaching the market",
      description:
        "A look at development gaps, packaging mistakes, and the missing bridge between creation and positioning.",
    },
    {
      title: "How investor-ready storytelling changes project value",
      description:
        "Why presentation quality, strategic framing, and market readiness shape decision-making.",
    },
    {
      title: "Building a media ecosystem beyond one project",
      description:
        "Turning isolated creative output into a scalable company model with long-term value.",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const goToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToPath = (href: string) => {
    window.location.href = href;
  };

  const getLeadTemperature = (
    message: string,
    phone: string
  ): LeadTemperature => {
    const text = message.toLowerCase().trim();

    const hotKeywords = [
      "investor",
      "investment",
      "budget",
      "funding",
      "finance",
      "financing",
      "partner",
      "partnership",
      "co-production",
      "coproduction",
      "distribution",
      "platform",
      "netflix",
      "urgent",
      "festival",
      "sales",
      "producer",
      "production",
    ];

    const hasHotKeyword = hotKeywords.some((word) => text.includes(word));
    const hasPhone = phone.trim().length >= 8;
    const isDetailed = text.length >= 80;

    if ((hasHotKeyword && hasPhone) || (hasHotKeyword && isDetailed)) {
      return "Hot";
    }

    if (text.length >= 30 || hasPhone) {
      return "Warm";
    }

    return "Cold";
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    const status = form.status;
    const leadTemperature = getLeadTemperature(message, phone);

    if (!name || !email || !phone || !message) {
      setError("Please complete all fields before submitting.");
      setSuccess("");
      return;
    }

    const whatsappWindow = window.open("", "_blank");

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          status,
          lead_temperature: leadTemperature,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (whatsappWindow && !whatsappWindow.closed) {
          whatsappWindow.close();
        }
        throw new Error(data?.detail || data?.error || "Submission failed.");
      }

      const whatsappMessage = `
🎬 CINENTO — New Project Submission

A new project has been submitted through the CINENTO platform.

━━━━━━━━━━━━━━━━━━
👤 Client Information
Name: ${name}
Email: ${email}
Phone: ${phone}

📌 Project Details
${message}

📊 Status: ${status}
🔥 Lead Priority: ${leadTemperature}
━━━━━━━━━━━━━━━━━━

This request has been automatically generated via CINENTO Web System.

Please review and proceed with evaluation, follow-up, and development pipeline.

— CINENTO
From Idea to International Film Market
      `.trim();

      const whatsappUrl = `https://wa.me/905461232134?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      setSuccess("Your project request was submitted successfully.");

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        status: "New",
      });
    } catch (err: unknown) {
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.close();
      }

      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 space-y-14">
        <header className="rounded-3xl bg-black/60 backdrop-blur border border-yellow-600/30 p-5 sticky top-4 z-50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-left text-xl font-semibold tracking-wide text-yellow-500"
            >
              CINENTO
            </button>

            <div className="flex flex-wrap gap-3 text-sm">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-4 py-2 rounded-xl bg-black/40 border border-yellow-600/20 hover:border-yellow-500 transition"
              >
                Home
              </button>
              <button
                onClick={() => goToSection("about")}
                className="px-4 py-2 rounded-xl bg-black/40 border border-yellow-600/20 hover:border-yellow-500 transition"
              >
                About
              </button>
              <button
                onClick={() => goToSection("platforms")}
                className="px-4 py-2 rounded-xl bg-black/40 border border-yellow-600/20 hover:border-yellow-500 transition"
              >
                Platforms
              </button>
              <button
                onClick={() => goToSection("gallery")}
                className="px-4 py-2 rounded-xl bg-black/40 border border-yellow-600/20 hover:border-yellow-500 transition"
              >
                Gallery
              </button>
              <button
                onClick={() => goToSection("journal")}
                className="px-4 py-2 rounded-xl bg-black/40 border border-yellow-600/20 hover:border-yellow-500 transition"
              >
                Journal
              </button>
              <button
                onClick={() => goToSection("contact")}
                className="px-4 py-2 rounded-xl bg-black/40 border border-yellow-600/20 hover:border-yellow-500 transition"
              >
                Contact
              </button>
            </div>
          </div>
        </header>

        <section className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.3em] text-yellow-600">
              CINENTO
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              From Idea to International Film Market
            </h1>

            <p className="text-lg text-neutral-300 leading-8 max-w-2xl">
              CINENTO is a next-generation film development platform connecting
              storytelling, financing, and distribution into one unified
              cinematic ecosystem.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => goToSection("platforms")}
                className="px-6 py-3 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 transition"
              >
                Explore Platform
              </button>
              <button
                onClick={() => goToSection("contact")}
                className="px-6 py-3 border border-yellow-600/40 rounded-xl hover:border-yellow-500 transition"
              >
                Start Project
              </button>
            </div>
          </div>

          <div className="h-[360px] rounded-3xl bg-gradient-to-br from-black via-neutral-900 to-black border border-yellow-600/20 flex items-center justify-center text-neutral-500 text-center px-8">
            Cinematic Visual Area
          </div>
        </section>

        <section
          id="about"
          className="grid md:grid-cols-2 gap-8 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <div className="space-y-4">
            <h2 className="text-2xl text-yellow-500 font-semibold">
              What We Do
            </h2>
            <div className="space-y-3 text-neutral-300 leading-7">
              <div>Film &amp; Series Development</div>
              <div>Co-Production Strategy</div>
              <div>Investor Packaging</div>
              <div>Distribution Strategy</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl text-yellow-500 font-semibold">
              Why CINENTO
            </h2>
            <div className="space-y-3 text-neutral-300 leading-7">
              <div>Turkey–GCC Bridge</div>
              <div>Creative + Financial Integration</div>
              <div>Scalable Media System</div>
              <div>Investor-Ready Output</div>
            </div>
          </div>
        </section>

        <section
          id="platforms"
          className="space-y-8 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-yellow-500">
              CINENTO Ecosystem
            </h2>
            <p className="text-neutral-400 max-w-3xl leading-7">
              A connected structure designed to combine creative development,
              project intake, business growth, and future-facing distribution
              under one brand ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {featuredModules.map((item) => (
              <button
                key={item.title}
                onClick={() => goToPath(item.href)}
                className="text-left p-6 rounded-2xl bg-black border border-yellow-600/20 hover:border-yellow-500 transition space-y-3"
              >
                <div className="text-lg font-medium text-yellow-500">
                  {item.title}
                </div>
                <div className="text-sm text-neutral-400 leading-7">
                  {item.description}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section
          id="gallery"
          className="space-y-8 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-yellow-500">
              CINENTO Gallery
            </h2>
            <p className="text-neutral-400 max-w-3xl leading-7">
              Selected visual frames designed to strengthen CINENTO’s cinematic
              identity, brand presence, and professional presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <img
              src="/images/gallery/gallery-1.jpg"
              alt="CINENTO Gallery 1"
              className="w-full h-[300px] object-cover rounded-2xl border border-yellow-600/20 hover:scale-[1.02] transition duration-300"
            />

            <img
              src="/images/gallery/gallery-2.jpg"
              alt="CINENTO Gallery 2"
              className="w-full h-[300px] object-cover rounded-2xl border border-yellow-600/20 hover:scale-[1.02] transition duration-300"
            />

            <img
              src="/images/gallery/gallery-3.jpg"
              alt="CINENTO Gallery 3"
              className="w-full h-[300px] object-cover rounded-2xl border border-yellow-600/20 hover:scale-[1.02] transition duration-300"
            />
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-5">
          {[
            {
              title: "Project Intake",
              desc: "Capture project opportunities directly from the website and turn visitors into active leads.",
            },
            {
              title: "Professional Positioning",
              desc: "Present CINENTO as a structured brand ready for partnerships, investors, and platform conversations.",
            },
            {
              title: "Scalable Infrastructure",
              desc: "Build a foundation that can grow into CRM, dashboards, internal tools, and service workflows.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-neutral-900 border border-yellow-600/20 p-6 space-y-3"
            >
              <div className="text-lg font-medium text-yellow-500">
                {item.title}
              </div>
              <div className="text-sm text-neutral-400 leading-7">
                {item.desc}
              </div>
            </div>
          ))}
        </section>

        <section
          id="journal"
          className="space-y-6 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <h2 className="text-2xl font-semibold text-yellow-500">
            CINENTO Journal
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {journalItems.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-black border border-yellow-600/20 space-y-3"
              >
                <div className="text-lg font-medium text-white leading-7">
                  {item.title}
                </div>
                <div className="text-sm text-neutral-400 leading-7">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-3xl bg-neutral-900 p-8 border border-yellow-600/20"
        >
          <h2 className="text-2xl text-yellow-500 mb-6 font-semibold">
            Start Your Project
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input
                name="name"
                placeholder="Name / Company"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                name="phone"
                placeholder="Phone / WhatsApp"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              >
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>

              <textarea
                name="message"
                placeholder="Tell us about your project"
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl h-32 outline-none focus:border-yellow-500"
              />

              {error ? <div className="text-sm text-red-400">{error}</div> : null}
              {success ? (
                <div className="text-sm text-green-400">{success}</div>
              ) : null}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-yellow-600 text-black rounded-xl hover:bg-yellow-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>

            <div className="text-neutral-400 leading-8">
              This is your real intake point for CINENTO leads.
              <br />
              <br />
              Every form submission can be sent to your backend, saved in your
              CRM, and used for the next stage of development.
              <br />
              <br />
              → New film lead
              <br />
              → New pitch deck request
              <br />
              → New investor or partner opportunity
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}