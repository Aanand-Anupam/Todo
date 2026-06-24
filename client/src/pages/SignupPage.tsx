import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (file: File | null) => {
    setAvatar(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8 || !/\d/.test(password)) {
      setError(
        "Password must be at least 8 characters with at least one number.",
      );
      return;
    }

    setLoading(true);
    try {
      await register({
        userName: userName.trim(),
        email: email.trim(),
        password,
        avatar: avatar ?? undefined,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <main className="mx-auto max-w-lg px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Join Do2Done
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Start your journey toward quiet productivity.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="text-center">
              <p className="mb-4 text-xs font-medium tracking-wider text-zinc-400 uppercase">
                Profile Avatar
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative mx-auto block"
              >
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-8 w-8 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded bg-black text-[10px] text-white">
                  📷
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={(e) =>
                  handleAvatarChange(e.target.files?.[0] ?? null)
                }
              />
              <p className="mt-3 text-[10px] tracking-wider text-zinc-400 uppercase italic">
                *Minimalist files only. JPG/PNG.*
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs text-zinc-500">
                Username
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-zinc-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-zinc-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-zinc-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-zinc-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Minimum 8 characters with at least one number.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
          Secured by Do2Done Shield
        </p>
      </main>

      <Footer />
    </div>
  );
}
