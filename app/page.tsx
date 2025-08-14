import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-700 rounded-xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white font-sans">Farm AI Control Center</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 font-sans">
            Monitor and control your closed farm environment
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
