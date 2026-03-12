import { useState } from "react"
import { useNavigate } from "react-router-dom"

const LEAVES_BG =
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1974&auto=format&fit=crop"

function Spinner() {
    return (
        <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    )
}

function Toast({ message, type }) {
    if (!message) return null
    const colors = type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
    return (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm font-medium ${colors}`}>
            {type === "success" ? "✓" : "✕"} {message}
        </div>
    )
}

function FieldError({ msg }) {
    if (!msg) return null
    return <p className="text-red-400 text-xs mt-1">{msg}</p>
}

export default function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ message: "", type: "" })

    function showToast(message, type = "error") {
        setToast({ message, type })
        setTimeout(() => setToast({ message: "", type: "" }), 3500)
    }

    function validate() {
        const e = {}
        if (!form.name.trim()) e.name = "Full name is required."
        if (!form.email.trim()) e.email = "Email is required."
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email."
        if (!form.password) e.password = "Password is required."
        else if (form.password.length < 6) e.password = "At least 6 characters."
        if (!form.confirm) e.confirm = "Please confirm your password."
        else if (form.confirm !== form.password) e.confirm = "Passwords do not match."
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1800))
        setLoading(false)
        showToast("Account created! Please log in.", "success")
        setTimeout(() => navigate("/login"), 1800)
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

                {/* ── Right: register form ── */}
                <div className="flex flex-col justify-center w-full md:w-1/2 px-10 lg:px-20 py-16 bg-[#1a1a1a]">
                    <div className="w-full max-w-sm mx-auto">

                        <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">
                            Create account
                        </h1>
                        <p className="text-[#9ca3af] text-sm mb-10">
                            Fill in the details below to get started.
                        </p>

                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

                            {/* Full Name */}
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-sm font-medium text-[#e5e7eb] mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={change("name")}
                                    autoComplete="name"
                                    disabled={loading}
                                    className={errors.name ? inputError : inputNormal}
                                />
                                <FieldError msg={errors.name} />
                            </div>

                            {/* E-mail */}
                            <div className="flex flex-col">
                                <label htmlFor="reg-email" className="text-sm font-medium text-[#e5e7eb] mb-2">
                                    E-mail
                                </label>
                                <input
                                    id="reg-email"
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
                                <label htmlFor="reg-password" className="text-sm font-medium text-[#e5e7eb] mb-2">
                                    Password
                                </label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={form.password}
                                    onChange={change("password")}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className={errors.password ? inputError : inputNormal}
                                />
                                <FieldError msg={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col">
                                <label htmlFor="confirm" className="text-sm font-medium text-[#e5e7eb] mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={form.confirm}
                                    onChange={change("confirm")}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className={errors.confirm ? inputError : inputNormal}
                                />
                                <FieldError msg={errors.confirm} />
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-lg bg-black hover:bg-zinc-800 active:scale-[0.98] active:bg-zinc-900 text-white font-semibold text-base transition-all duration-150 mt-1 border border-[#333] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        <span>Creating account…</span>
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </button>

                            {/* Back to login */}
                            <p className="text-center text-sm text-[#6b7280]">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-white font-semibold hover:underline active:scale-95 transition-all duration-150 cursor-pointer"
                                >
                                    Login here
                                </button>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
