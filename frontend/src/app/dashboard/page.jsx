"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user && !localStorage.getItem("access_token")) router.push("/login");
  }, [user, router]);

  const callModel = async (endpoint, method) => {
    try {
      const res = await api.callAI(endpoint, method, token);
      setMessage(res.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!user) return <p className="text-center">Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {user.email}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-bold mt-2 inline-block ${
            user.role === 'Admin' ? 'bg-red-500' : user.role === 'Premium_User' ? 'bg-purple-500' : 'bg-green-500'
          }`}>
            {user.role}
          </span>
        </div>
        <button onClick={() => { logout(); router.push("/login"); }} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg">Logout</button>
      </div>

      {message && <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold mb-2">Free AI Model</h3>
          <p className="text-slate-400 mb-4">Standard text generation.</p>
          <button onClick={() => callModel("/api/ai/free-model", "GET")} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg w-full">Run Free Model</button>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold mb-2">Premium AI Model</h3>
          <p className="text-slate-400 mb-4">High-compute image generation. (Premium/Admin only)</p>
          <button onClick={() => callModel("/api/ai/premium-model", "POST")} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg w-full">Run Premium Model</button>
        </div>
      </div>

      {user.role === "Admin" && (
        <div className="bg-slate-800 p-6 rounded-xl border border-red-500/50">
          <h3 className="text-xl font-bold mb-2 text-red-400">Admin Controls</h3>
          <button onClick={() => callModel("/api/ai/purge-cache", "DELETE")} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Purge System Cache</button>
        </div>
      )}
    </div>
  );
}