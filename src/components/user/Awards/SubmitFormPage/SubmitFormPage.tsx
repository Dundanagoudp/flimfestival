"use client";

import React, { useEffect, useRef, useState } from "react";
import { createSubmission } from "@/services/submisionService"; // keep your path

type VideoCategory = "Short Film" | "Documentary";

const PHONE_PREFIX = "+91";

export default function SubmitFormPage() {
  const [category, setCategory] = useState<VideoCategory>("Short Film");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [videoType, setVideoType] = useState<VideoCategory>("Short Film");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // refs to reset controlled <input type="file" />
  const fileInputRef = useRef<HTMLInputElement>(null);

  // helper: keep chip + select fully in sync
  const setType = (val: VideoCategory) => {
    setCategory(val);
    setVideoType(val);
  };

  // auto-hide success notice
  useEffect(() => {
    if (notice?.type === "success") {
      const t = setTimeout(() => setNotice(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notice]);

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/[^\d]/g, "");
    if (digits.startsWith("91")) digits = digits.slice(2);
    digits = digits.slice(0, 10);
    setPhone(PHONE_PREFIX + digits);
  };

  function validate() {
    if (!name.trim() || name.trim().length < 2) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
    if (!/^\+91\d{10}$/.test(phone)) return "Phone must be +91 followed by 10 digits.";
    if (!videoType) return "Please select a video type.";
    if (!file) return "Please attach your video file.";
    if (!message.trim()) return "Please add a short message.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    const err = validate();
    if (err) return setNotice({ type: "error", text: err });

    try {
      setLoading(true);

      await createSubmission({
        fullName: name,
        email,
        phone,
        videoType,        // "Short Film" | "Documentary"
        videoFile: file!, // File
        message,
      });

      // success message
      setNotice({ type: "success", text: "Thanks! Your film has been submitted." });

      // reset all fields
      setName("");
      setEmail("");
      setPhone(PHONE_PREFIX);
      setType("Short Film"); // resets chips + select consistently
      setFile(null);
      setMessage("");

      // clear the native file input value
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      setNotice({
        type: "error",
        text: error?.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Chips (centered) */}
        <div className="flex items-center justify-center gap-3">
          {(["Short Film", "Documentary"] as VideoCategory[]).map((label) => {
            const active = category === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setType(label)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
          <h3 className="font-montserrat text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Submit Your {videoType}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill all information details to consult with us to get services from us
          </p>

          {notice && (
            <div
              className={`mt-6 rounded-md px-4 py-3 text-sm ${
                notice.type === "success"
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {notice.text}
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-0 border-b border-input bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 focus:border-b-transparent focus:ring-2 focus:ring-ring"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 border-b border-input bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 focus:border-b-transparent focus:ring-2 focus:ring-ring"
              required
            />

            <input
              type="tel"
              inputMode="numeric"
              pattern="^\+91\d{10}$"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={onPhoneChange}
              onFocus={() => {
                if (!phone.startsWith(PHONE_PREFIX)) setPhone(PHONE_PREFIX);
              }}
              maxLength={13}
              className="w-full border-0 border-b border-input bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 focus:border-b-transparent focus:ring-2 focus:ring-ring"
              required
            />

            {/* Select (synced with chips) */}
            <select
              value={videoType}
              onChange={(e) => setType(e.target.value as VideoCategory)}
              className="w-full appearance-none border-0 border-b border-input bg-transparent px-1 pb-2 pt-1 text-sm outline-none focus:border-b-transparent focus:ring-2 focus:ring-ring"
              required
            >
              <option value="" disabled>
                Video Type
              </option>
              <option value="Short Film">Short Film</option>
              <option value="Documentary">Documentary</option>
            </select>

            {/* File input */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Video File</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium"
                required
              />
            </label>

            <textarea
              rows={5}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-y border-0 border-b border-input bg-transparent px-1 pb-2 pt-1 text-sm outline-none placeholder:text-muted-foreground/80 focus:border-b-transparent focus:ring-2 focus:ring-ring"
              required
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
                {!loading && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414L13.172 12Z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
