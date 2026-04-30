"use client";

/**
 * File: app/[lang]/contact/page.tsx
 * Version: v3.3 CONTACT PAGE CLEAN LAYOUT
 * Updated: 2026-04-29 [Europe/Istanbul]
 * Status: HEADER REMOVED FROM PAGE + FOOTER REMOVED FROM PAGE
 */

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { homepageContent } from "../../../content/homepage";
import { defaultLanguage, isValidLanguage, type SiteLanguage } from "@/lib/i18n";

export default function ContactPage() {
  const params = useParams();
  const routeLang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  const language: SiteLanguage =
    typeof routeLang === "string" && isValidLanguage(routeLang)
      ? routeLang
      : defaultLanguage;

  const content = useMemo(() => homepageContent[language], [language]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setFeedback(content.contact.errorRequired);
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.replace(/\D/g, ""),
          message: message.trim(),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact request.");
      }

      const whatsappText = `
🎬 CINENTO — Contact Request

Language: ${language.toUpperCase()}

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `.trim();

      window.open(
        `https://wa.me/905461232134?text=${encodeURIComponent(whatsappText)}`,
        "_blank"
      );

      setFeedback(content.contact.successMessage);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setFeedback("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
        <div className="rounded-3xl bg-neutral-900 p-8 border border-yellow-600/20">
          <h1 className="text-4xl md:text-6xl text-yellow-500 mb-8 font-bold">
            {content.contact.title}
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={content.contact.namePlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.contact.emailPlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={content.contact.phonePlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={content.contact.messagePlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl h-32 outline-none focus:border-yellow-500"
              />

              {feedback ? (
                <div className="text-sm text-yellow-300">{feedback}</div>
              ) : null}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-yellow-600 text-black rounded-xl hover:bg-yellow-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? content.contact.submittingLabel
                  : content.contact.submitLabel}
              </button>
            </div>

            <div className="text-neutral-400 leading-8 whitespace-pre-line">
              {content.contact.sideText}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}