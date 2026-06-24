import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({
        userName: userName.trim() || undefined,
        email: email.trim() || undefined,
        password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar variant="minimal" />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Sign in to your productivity space.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            <label className="mb-2 block text-xs font-medium tracking-wider text-zinc-400 uppercase">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-md border border-zinc-200 px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium tracking-wider text-zinc-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-zinc-200 px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
                Password
              </label>
              <span className="cursor-default text-xs tracking-wider text-zinc-400 uppercase">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-200 px-4 py-3 pr-12 text-sm text-black outline-none transition focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-zinc-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black py-3 text-sm font-semibold tracking-wider text-white uppercase transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-black hover:underline"
          >
            Create one
          </Link>
        </p>
      </main>

      <Footer compact />
    </div>
  );
}
