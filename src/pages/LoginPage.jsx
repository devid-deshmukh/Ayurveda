import { useState } from "react"
import { useNavigate } from "react-router-dom"

const LEAVES_BG =
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1974&auto=format&fit=crop"

// ── Spinner SVG ──────────────────────────────────────────
function Spinner() {
    return (
        <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    )
}

// ── Toast ────────────────────────────────────────────────
function Toast({ message, type }) {
    if (!message) return null
    const colors =
        type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
    return (
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm font-medium transition-all animate-fade-in ${colors}`}
        >
            {type === "success" ? "✓" : "✕"} {message}
        </div>
    )
}

// ── Inline field error ───────────────────────────────────
function FieldError({ msg }) {
    if (!msg) return null
    return <p className="text-red-400 text-xs mt-1">{msg}</p>
}

export default function LoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: "", password: "" })
    const [errors, setErrors] = useState({})
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ message: "", type: "" })
    const [showPass, setShowPass] = useState(false)

    function showToast(message, type = "error") {
        setToast({ message, type })
        setTimeout(() => setToast({ message: "", type: "" }), 3500)
    }

    function validate() {
        const e = {}
        if (!form.email.trim()) e.email = "Email is required."
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email."
        if (!form.password) e.password = "Password is required."
        else if (form.password.length < 6) e.password = "At least 6 characters."
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1800))
        setLoading(false)
        showToast("Logged in successfully!", "success")
        console.log("Login:", { ...form, rememberMe })
    }

    function change(field) {
        return (e) => {
            setForm((f) => ({ ...f, [field]: e.target.value }))
            if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }))
        }
    }

    const inputBase =
        "w-full bg-transparent border-0 border-b pb-2 text-white text-sm placeholder:text-[#6b7280] outline-none transition-colors duration-200"
    const inputNormal = `${inputBase} border-[#4b5563] focus:border-[#d1d5db]`
    const inputError = `${inputBase} border-red-500 focus:border-red-400`

    return (
        <>
            <Toast message={toast.message} type={toast.type} />

            <div className="min-h-screen flex">
                {/* ── Left: leaf photo ── */}
                <div
                    className="hidden md:block w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: `url('${LEAVES_BG}')` }}
                    aria-hidden="true"
                />

                {/* ── Right: form panel ── */}
                <div className="flex flex-col justify-center w-full md:w-1/2 px-10 lg:px-20 py-16 bg-[#1a1a1a]">
                    <div className="w-full max-w-sm mx-auto">

                        <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-[#9ca3af] text-sm mb-10">
                            Please enter your details.
                        </p>

                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

                            {/* E-mail */}
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-sm font-medium text-[#e5e7eb] mb-2">
                                    E-mail
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your e-mail"
                                    value={form.email}
                                    onChange={change("email")}
                                    autoComplete="email"
                                    disabled={loading}
                                    className={errors.email ? inputError : inputNormal}
                                />
                                <FieldError msg={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-sm font-medium text-[#e5e7eb] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={change("password")}
                                        autoComplete="current-password"
                                        disabled={loading}
                                        className={`${errors.password ? inputError : inputNormal} pr-10`}
                                    />
                                    {/* Show / hide toggle */}
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPass((s) => !s)}
                                        className="absolute right-0 bottom-2.5 text-[#6b7280] hover:text-[#d1d5db] transition-colors text-xs select-none"
                                        aria-label={showPass ? "Hide password" : "Show password"}
                                    >
                                        {showPass ? "Hide" : "Show"}
                                    </button>
                                </div>
                                <FieldError msg={errors.password} />
                            </div>

                            {/* Remember me + Forgot password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-[#d1d5db] cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                        className="w-3.5 h-3.5 rounded-sm border border-[#6b7280] bg-transparent accent-white cursor-pointer"
                                    />
                                    <span className="group-hover:text-white transition-colors">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-sm text-[#d1d5db] font-semibold hover:text-white active:scale-95 transition-all duration-150"
                                >
                                    Forgot your password?
                                </button>
                            </div>

                            {/* Log in button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-lg bg-black hover:bg-zinc-800 active:scale-[0.98] active:bg-zinc-900 text-white font-semibold text-base transition-all duration-150 mt-1 border border-[#333] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        <span>Logging in…</span>
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </button>

                            {/* Register */}
                            <p className="text-center text-sm text-[#6b7280]">
                                Don&apos;t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="text-white font-semibold hover:underline active:scale-95 transition-all duration-150 cursor-pointer"
                                >
                                    Register here
                                </button>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
