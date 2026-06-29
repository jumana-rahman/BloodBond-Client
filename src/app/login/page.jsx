"use client";

import { useState } from "react";
import {
  Form,
  Fieldset,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { Eye, EyeSlash, ArrowRight } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isEmailInvalid =
    formData.email.length > 0 && !/\S+@\S+\.\S+/.test(formData.email);
  const isPasswordInvalid =
    formData.password.length > 0 && formData.password.length < 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Sign in via better-auth
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message || "Invalid email or password.");

      // Step 2: Check user status from your MongoDB (blocked users must not proceed)
      // We look up by email to get role + status stored in your DB
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const profileRes = await fetch(
        `${baseURL}/api/users/by-email?email=${encodeURIComponent(formData.email)}`
      );

      if (!profileRes.ok) throw new Error("Failed to fetch user profile.");

      const userProfile = await profileRes.json();

      if (userProfile?.status === "blocked") {
        // Sign them back out immediately — blocked users cannot access the app
        await authClient.signOut();
        throw new Error(
          "Your account has been blocked. Please contact support."
        );
      }

      toast.success(`Welcome back, ${userProfile?.name || "donor"}!`);
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white antialiased text-gray-900">
      {/* Brand Sidebar */}
      <div
        className="hidden lg:flex lg:col-span-4 flex-col justify-between p-8 text-white relative overflow-hidden"
        style={{ backgroundColor: "#C62828" }}
      >
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="my-auto space-y-4 max-w-sm relative z-10">
          <h1 className="text-4xl font-black tracking-tight leading-none">
            Welcome Back, Lifesaver.
          </h1>
          <p className="text-red-100 text-sm leading-relaxed">
            Log in to manage your donor profile, respond to blood requests, and
            help save lives in your area.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="lg:col-span-8 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Access your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue to BloodBond.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            <Fieldset>
              <Fieldset.Legend className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                Your Credentials
              </Fieldset.Legend>

              <Fieldset.Group className="flex flex-col gap-y-5 w-full">
                {/* Email */}
                <TextField isInvalid={isEmailInvalid} className="w-full">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FieldError className="text-xs">
                    Please enter a valid email address
                  </FieldError>
                </TextField>

                {/* Password */}
                <TextField isInvalid={isPasswordInvalid} className="w-full">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlash className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FieldError className="text-xs">
                    Password must be at least 6 characters
                  </FieldError>
                </TextField>
              </Fieldset.Group>

              <Fieldset.Actions className="mt-8 flex flex-col gap-4">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full py-6 font-bold text-sm tracking-wide text-white rounded-xl shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#C62828" }}
                >
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>

                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-bold hover:underline"
                      style={{ color: "#C62828" }}
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </Fieldset.Actions>
            </Fieldset>
          </Form>
        </div>
      </div>
    </div>
  );
}