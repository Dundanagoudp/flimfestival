"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ContactService from "@/services/contactServices";
import type { Contact, ContactForm } from "@/types/contactTypes";
import { useToast } from "@/components/ui/custom-toast";

const PHONE_PREFIX = "+91";

export default function ContactForm() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: PHONE_PREFIX, // default prefix
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

  // Fixed phone handler
  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // If the value doesn't start with the prefix, we'll force it
    if (!raw.startsWith(PHONE_PREFIX)) {
      // Extract digits from anywhere in the input
      const digits = raw.replace(/[^\d]/g, "");
      // Format with prefix and limit to 10 digits after prefix
      const formatted = PHONE_PREFIX + digits.slice(0, 10);
      setForm((f) => ({ ...f, phone: formatted }));
    } else {
      // If it starts with the prefix, we can process normally
      // Get everything after the prefix
      const afterPrefix = raw.slice(PHONE_PREFIX.length);
      // Keep only digits
      let digits = afterPrefix.replace(/[^\d]/g, "");
      // limit to 10 digits
      digits = digits.slice(0, 10);
      const formatted = PHONE_PREFIX + digits;
      setForm((f) => ({ ...f, phone: formatted }));
    }
  };

  function validate(f: ContactForm): string | null {
    if (!f.name.trim() || f.name.trim().length < 2) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return "Please enter a valid email.";
    // Require "+91" followed by exactly 10 digits
    if (!/^\+91\d{10}$/.test(f.phone)) return "Phone must be +91 followed by 10 digits.";
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
      setForm({ name: "", email: "", phone: PHONE_PREFIX, message: "" });
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
        {/* 3 info items */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Location */}
          <div className="flex items-start gap-4 border-y md:border-y-0 md:border-x md:px-6 border-border/70 py-6 md:py-8">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
            </span>
            <div>
              <p className="font-montserrat text-lg font-semibold">Location</p>
              <p className="mt-1 text-sm text-muted-foreground">
                401 Broadway, 24th Floor, Orchard View, London
              </p>
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-start gap-4 border-y md:border-y-0 md:border-x md:px-6 border-border/70 py-6 md:py-8">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.3.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.85 21 3 12.15 3 1a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1c0 1.28.2 2.47.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z" />
              </svg>
            </span>
            <div>
              <p className="font-montserrat text-lg font-semibold">Phone number</p>
              <p className="mt-1 text-sm text-muted-foreground">+(084) 123 - 456 88</p>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-start gap-4 border-y md:border-y-0 md:border-x md:px-6 md:last:border-r border-border/70 py-6 md:py-8">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm2 5.2-9.34 5.82a2 2 0 0 1-2.32 0L1 9.2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.2Z" />
              </svg>
            </span>
            <div>
              <p className="font-montserrat text-lg font-semibold">Support email</p>
              <p className="mt-1 text-sm text-muted-foreground">support@example.com</p>
            </div>
          </div>
        </div>
        {/* Image + Form */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          {/* Left image */}
          <div className="rounded-2xl bg-card p-1 shadow-sm">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/video.png"
                alt="Studio / event photo"
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
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="^\+91\d{10}$"
                    placeholder="+91XXXXXXXXXX"
                    value={form.phone}
                    onChange={onPhoneChange}
                    onFocus={() => {
                      // Ensure prefix remains if the field gets cleared by browser autofill quirks
                      if (!form.phone.startsWith(PHONE_PREFIX)) {
                        setForm((f) => ({ ...f, phone: PHONE_PREFIX }));
                      }
                    }}
                    maxLength={13} // "+91" (3 chars inc '+') + 10 digits
                    className="w-full bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 border-0 border-b border-input focus:border-b-transparent focus:ring-2 focus:ring-ring"
                  />
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
