"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const emptyUser = {
  name: "",
  photo: "",
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
  const { data = [], mutate } = useSWR("/api/users", fetcher, {
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
                className="w-16 h-16 rounded-full border bg-gray-100"
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
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setOpenId(openId === user.id ? null : user.id)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                {openId === user.id ? "Hide" : "Details"}
              </button>
            </div>

            {/* DETAILS */}
            {openId === user.id && (
              <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-2 text-sm">
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
          <div className="bg-white w-full max-w-xl p-6 rounded-xl space-y-4 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit User" : "Add User"}
            </h2>

            {/* IMAGE PREVIEW + INPUT */}
            <div className="flex items-center gap-4">
              <img
                src={
                  form.photo ||
                  `https://api.dicebear.com/7.x/personas/svg?seed=${form.name || "User"}`
                }
                className="w-16 h-16 rounded-full border bg-gray-100"
              />

              <input
                name="photo"
                placeholder="Image URL"
                value={form.photo}
                onChange={handleChange}
                className="flex-1 border p-2 rounded"
              />
            </div>

            {/* BASIC */}
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="input"
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
            <input
              name="phoneNumber"
              placeholder="Phone"
              value={form.phoneNumber}
              onChange={handleChange}
              className="input"
            />

            {/* INFO */}
            <input
              name="uniqueIdNumber"
              placeholder="ID Number"
              value={form.uniqueIdNumber}
              onChange={handleChange}
              className="input"
            />
            <input
              name="gender"
              placeholder="Gender"
              value={form.gender}
              onChange={handleChange}
              className="input"
            />
            <input
              name="bloodType"
              placeholder="Blood Type"
              value={form.bloodType}
              onChange={handleChange}
              className="input"
            />

            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="input"
            />
            <input
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              className="input"
            />
            <input
              name="issuedDate"
              type="date"
              value={form.issuedDate}
              onChange={handleChange}
              className="input"
            />

            <input
              name="nationality"
              placeholder="Nationality"
              value={form.nationality}
              onChange={handleChange}
              className="input"
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="input"
            />
            <input
              name="issuingAuthority"
              placeholder="Authority"
              value={form.issuingAuthority}
              onChange={handleChange}
              className="input"
            />

            {/* EMERGENCY */}
            <p className="font-semibold">Emergency Contact</p>
            <input
              name="name"
              placeholder="Name"
              value={form.emergencyContact.name}
              onChange={handleEmergency}
              className="input"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.emergencyContact.phone}
              onChange={handleEmergency}
              className="input"
            />

            {/* ACTIONS */}
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

      {/* STYLE */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ccc;
          padding: 8px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
