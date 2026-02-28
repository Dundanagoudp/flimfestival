"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ContactService from "@/services/contactServices";
import type { Contact, ContactForm } from "@/types/contactTypes";
import { useToast } from "@/components/ui/custom-toast";

export default function ContactForm() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-dismiss success notice after 5s
  useEffect(() => {
    if (notice?.type === "success") {
      const t = setTimeout(() => setNotice(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notice]);

  const onChange =
    (key: keyof Contact) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  function validate(f: ContactForm): string | null {
    if (!f.name.trim() || f.name.trim().length < 2) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return "Please enter a valid email.";
    if (!f.message.trim()) return "Please write a short message.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    const error = validate(form);
    if (error) {
      setNotice({ type: "error", text: error });
      return;
    }
    try {
      setLoading(true);
      await ContactService.createRegistration(form);

      toast.showToast("Thanks! We’ll get back to you shortly.", "success");
      setNotice({ type: "success", text: "Thanks! We’ll get back to you shortly." });
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.showToast("Something went wrong. Please try again.", "error");
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setNotice({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Top intro */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-montserrat text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
            If there is anything you would like to talk about, please feel free to contact us.
          </h2>
        </div>
        {/* 2 info items: Location + Email (from footer) */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Location - matches footer Office address */}
          <div className="flex items-start gap-4 border-y md:border-y-0 md:border-x md:px-6 border-border/70 py-6 md:py-8">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
            </span>
            <div>
              <p className="font-montserrat text-lg font-semibold">Office address</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Directorate of Information and Public Relations (Soochna bhawan), papu nallah, Naharlagun, Arunachal Pradesh Pin - 791110
              </p>
            </div>
          </div>
          {/* Email - matches footer */}
          <div className="flex items-start gap-4 border-y md:border-y-0 md:border-x md:px-6 md:last:border-r border-border/70 py-6 md:py-8">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm2 5.2-9.34 5.82a2 2 0 0 1-2.32 0L1 9.2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.2Z" />
              </svg>
            </span>
            <div>
              <p className="font-montserrat text-lg font-semibold">Support email</p>
              <p className="mt-1 text-sm text-muted-foreground">affdipr2013@gmail.com</p>
            </div>
          </div>
        </div>
        {/* Image + Form */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          {/* Left image */}
          <div className="rounded-2xl bg-card p-1 shadow-sm">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/ContactUs.png"
                alt="Contact Us"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
          {/* Form card */}
          <div className="rounded-2xl bg-card shadow-sm">
            <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-8">
              <h3 className="font-montserrat text-3xl font-semibold tracking-tight text-foreground">
                Leave a message
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill all information details to consult with us to get services from us
              </p>
              {/* Notice */}
              {notice && (
                <div
                  className={`mt-6 rounded-md px-4 py-3 text-sm ${
                    notice.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {notice.text}
                </div>
              )}
              <form className="mt-8" onSubmit={handleSubmit}>
                {/* Underline-only inputs */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="group">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={form.name}
                      onChange={onChange("name")}
                      className="w-full bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 border-0 border-b border-input focus:border-b-transparent focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="group">
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={form.email}
                      onChange={onChange("email")}
                      className="w-full bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 border-0 border-b border-input focus:border-b-transparent focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <textarea
                    rows={5}
                    placeholder="Message"
                    value={form.message}
                    onChange={onChange("message")}
                    className="w-full resize-y bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 border-0 border-b border-input focus:border-b-transparent focus:ring-2 focus:ring-ring"
                  />
                </div>
                {/* Button row */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* end form card */}
        </div>
      </div>
    </section>
  );
}
