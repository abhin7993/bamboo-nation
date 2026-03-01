"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Date Night",
  "Family Lunch",
  "Friends",
  "Business",
  "Other",
];

function ReservationForm() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "direct";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    party_size: "",
    occasion: "",
    special_requests: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create reservation");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bamboo-cream px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">&#127811;</div>
          <h2 className="text-2xl font-bold text-bamboo-green mb-2">
            Reservation Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you, <span className="font-semibold">{form.name}</span>. We
            have your reservation for{" "}
            <span className="font-semibold">{form.party_size}</span> on{" "}
            <span className="font-semibold">{form.date}</span> at{" "}
            <span className="font-semibold">{form.time}</span>.
          </p>
          <p className="text-sm text-gray-500">
            We&apos;ll reach out to confirm on{" "}
            <span className="font-medium">{form.phone}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bamboo-cream py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-bamboo-green">
            The Bamboo Nation
          </h1>
          <p className="text-bamboo-brown mt-1">Reserve Your Table</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bamboo-green/50 focus:border-bamboo-green"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bamboo-green/50 focus:border-bamboo-green"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bamboo-green/50 focus:border-bamboo-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bamboo-green/50 focus:border-bamboo-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Party Size *
            </label>
            <input
              type="number"
              name="party_size"
              required
              min="1"
              max="50"
              value={form.party_size}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bamboo-green/50 focus:border-bamboo-green"
              placeholder="Number of guests"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occasion
            </label>
            <select
              name="occasion"
              value={form.occasion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bamboo-green/50 focus:border-bamboo-green bg-white"
            >
              <option value="">Select an occasion</option>
              {OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              name="special_requests"
              value={form.special_requests}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bamboo-green/50 focus:border-bamboo-green resize-none"
              placeholder="Any dietary requirements, seating preferences..."
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-bamboo-green text-white py-3 rounded-lg font-medium text-lg hover:bg-bamboo-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Reserving..." : "Reserve Table"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ReservePage() {
  return (
    <Suspense>
      <ReservationForm />
    </Suspense>
  );
}
