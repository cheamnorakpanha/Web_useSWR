"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const emptyUser = {
  name: "",
  uniqueIdNumber: "",
  dateOfBirth: "",
  expiryDate: "",
  gender: "",
  address: "",
  nationality: "",
  phoneNumber: "",
  email: "",
  bloodType: "",
  issuedDate: "",
  issuingAuthority: "",
  emergencyContact: { name: "", phone: "" },
};

export default function Users({ fallbackData }) {
  const {
    data = [],
    mutate,
    isLoading,
  } = useSWR("/api/users", fetcher, {
    fallbackData,
  });

  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openId, setOpenId] = useState(null);

  // ---------- FORM ----------
  const openCreate = () => {
    setForm(emptyUser);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (user) => {
    setForm(user);
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmergency = (e) => {
    setForm({
      ...form,
      emergencyContact: {
        ...form.emergencyContact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    if (editingId) {
      await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ id: editingId, ...form }),
      });
    } else {
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setShowForm(false);
    mutate();
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    mutate();
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>

        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto space-y-4">
        {data.map((user) => (
          <div key={user.id} className="bg-white p-5 rounded-xl shadow">
            <div className="flex gap-4">
              <img
                src={
                  user.photo ||
                  `https://api.dicebear.com/7.x/personas/svg?seed=${user.name}`
                }
                className="w-16 h-16 rounded-full bg-gray-200 border"
              />

              <div className="flex-1">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-700">
                  ID: {user.uniqueIdNumber}
                </p>
                <p className="text-sm text-gray-700">{user.email}</p>
                <p className="text-sm text-gray-700">{user.phoneNumber}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openEdit(user)}
                className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setOpenId(openId === user.id ? null : user.id)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                {openId === user.id ? "Hide" : "Details"}
              </button>
            </div>

            {/* DETAILS */}
            {openId === user.id && (
              <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-2 text-sm text-gray-800">
                <p>
                  <b>Gender:</b> {user.gender}
                </p>
                <p>
                  <b>DOB:</b> {user.dateOfBirth}
                </p>

                <p>
                  <b>Nationality:</b> {user.nationality}
                </p>
                <p>
                  <b>Blood:</b> {user.bloodType}
                </p>

                <p className="col-span-2">
                  <b>Address:</b> {user.address}
                </p>

                <p>
                  <b>Issued:</b> {user.issuedDate}
                </p>
                <p>
                  <b>Expiry:</b> {user.expiryDate}
                </p>

                <p className="col-span-2">
                  <b>Authority:</b> {user.issuingAuthority}
                </p>

                <p className="col-span-2">
                  <b>Emergency:</b> {user.emergencyContact?.name} (
                  {user.emergencyContact?.phone})
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl p-6 rounded-xl space-y-3 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit User" : "Add User"}
            </h2>

            {Object.keys(emptyUser).map((key) => {
              if (key === "emergencyContact") return null;

              return (
                <input
                  key={key}
                  name={key}
                  placeholder={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-gray-900 placeholder:text-gray-500 p-2 rounded"
                />
              );
            })}

            <p className="font-semibold">Emergency Contact</p>

            <input
              name="name"
              placeholder="Name"
              value={form.emergencyContact.name}
              onChange={handleEmergency}
              className="w-full border p-2 rounded"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.emergencyContact.phone}
              onChange={handleEmergency}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
