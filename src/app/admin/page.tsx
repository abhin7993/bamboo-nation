"use client";

import { useState, useEffect, useCallback } from "react";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  party_size: number;
  occasion: string | null;
  special_requests: string | null;
  source: string;
  chat_summary: string | null;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    const params = sourceFilter !== "all" ? `?source=${sourceFilter}` : "";
    const res = await fetch(`/api/reservations${params}`);
    const data = await res.json();
    setReservations(data);
    setLoading(false);
  }, [sourceFilter]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchReservations();
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null));
    }
    setUpdating(null);
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  }

  function sourceBadge(source: string) {
    if (source === "whatsapp") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
          WhatsApp
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        {source}
      </span>
    );
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(timeStr: string) {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  }

  function formatCreatedAt(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-bamboo-cream">
      {/* Header */}
      <header className="bg-white border-b border-bamboo-cream-dark px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-bamboo-green">
              Reservations
            </h1>
            <p className="text-sm text-gray-500">The Bamboo Nation, Jaipur</p>
          </div>
          <div className="flex gap-2">
            {["all", "direct", "whatsapp"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSourceFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sourceFilter === filter
                    ? "bg-bamboo-green text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {filter === "all"
                  ? "All"
                  : filter === "whatsapp"
                    ? "WhatsApp"
                    : "Direct"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading reservations...
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reservations found.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Phone
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Time
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Party
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Occasion
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Source
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Created
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="border-b border-gray-100 hover:bg-bamboo-cream/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{r.name}</td>
                      <td className="px-4 py-3 text-gray-600">{r.phone}</td>
                      <td className="px-4 py-3">{formatDate(r.date)}</td>
                      <td className="px-4 py-3">{formatTime(r.time)}</td>
                      <td className="px-4 py-3">{r.party_size}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.occasion || "—"}
                      </td>
                      <td className="px-4 py-3">{sourceBadge(r.source)}</td>
                      <td className="px-4 py-3">{statusBadge(r.status)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatCreatedAt(r.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="flex gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {r.status !== "confirmed" && (
                            <button
                              onClick={() => updateStatus(r.id, "confirmed")}
                              disabled={updating === r.id}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}
                          {r.status !== "cancelled" && (
                            <button
                              onClick={() => updateStatus(r.id, "cancelled")}
                              disabled={updating === r.id}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {reservations.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="p-4 hover:bg-bamboo-cream/50 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-gray-500">{r.phone}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {sourceBadge(r.source)}
                      {statusBadge(r.status)}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>{formatDate(r.date)}</span>
                    <span>{formatTime(r.time)}</span>
                    <span>{r.party_size} guests</span>
                  </div>
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(r.id, "confirmed")}
                        disabled={updating === r.id}
                        className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}
                    {r.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(r.id, "cancelled")}
                        disabled={updating === r.id}
                        className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-bamboo-green">
                {selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Party Size</p>
                  <p className="font-medium">{selected.party_size} guests</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selected.date)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(selected.time)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Occasion</p>
                  <p className="font-medium">{selected.occasion || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Source</p>
                  <p>{sourceBadge(selected.source)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p>{statusBadge(selected.status)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {formatCreatedAt(selected.created_at)}
                  </p>
                </div>
              </div>

              {selected.special_requests && (
                <div>
                  <p className="text-gray-500 mb-1">Special Requests</p>
                  <p className="bg-bamboo-cream rounded-lg p-3">
                    {selected.special_requests}
                  </p>
                </div>
              )}

              {selected.chat_summary && (
                <div>
                  <p className="text-gray-500 mb-1">Chat Summary</p>
                  <p className="bg-bamboo-cream rounded-lg p-3">
                    {selected.chat_summary}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              {selected.status !== "confirmed" && (
                <button
                  onClick={() => updateStatus(selected.id, "confirmed")}
                  disabled={updating === selected.id}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Confirm
                </button>
              )}
              {selected.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(selected.id, "cancelled")}
                  disabled={updating === selected.id}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
