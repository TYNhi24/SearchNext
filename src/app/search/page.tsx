"use client";

import { useState } from "react";

export default function SearchUserPage() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<{
    id: string;
    email: string;
    role: string;
    createdAt: string;
    created_at?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setUser(null);
    setLoading(true);

    try {
      if (!email || !email.includes("@")) {
        throw new Error("Vui lòng nhập email hợp lệ.");
      }

      const res = await fetch(`/api/user/search?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không tìm thấy user.");
      }

      setUser(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Tìm kiếm User theo Email</h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email..."
          className="flex-1 p-2 border rounded"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user && (
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Thông tin User</h2>
          <p><b>ID:</b> {user.id}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Created At:</b> {new Date(user.createdAt || user.created_at!).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}