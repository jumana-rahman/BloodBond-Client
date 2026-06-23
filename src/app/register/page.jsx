"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    district: "",
    upazila: ""
  });

  const [avatarFile, setAvatarFile] = useState(null);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    if (!form.name) return "Name required";

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return "Invalid email";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      return "Passwords do not match";

    if (!form.bloodGroup) return "Blood group required";
    if (!form.district) return "District required";
    if (!form.upazila) return "Upazila required";
    if (!avatarFile) return "Avatar required";

    return null;
  };

  // ---------------- IMAGE UPLOAD ----------------
  const uploadAvatar = async () => {
    const formData = new FormData();
    formData.append("image", avatarFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();
    return data.data.url;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return alert(error);

    try {
      // 1. Better Auth signup
      await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name
      });

      // 2. Upload avatar
      const avatarUrl = await uploadAvatar();

      // 3. Sync to backend (MongoDB)
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          avatar: avatarUrl,
          bloodGroup: form.bloodGroup,
          district: form.district,
          upazila: form.upazila
        })
      });

      alert("Registration successful!");
      router.push("/login");

    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          placeholder="Name"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="file"
          onChange={(e) => setAvatarFile(e.target.files[0])}
        />

        <select
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, bloodGroup: e.target.value })
          }
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <input
          placeholder="District"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, district: e.target.value })
          }
        />

        <input
          placeholder="Upazila"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, upazila: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button className="bg-red-600 text-white w-full py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}