import React from 'react'
import { useBetterAuth } from '../hooks/useBetterAuth'
import { Github, Chrome } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, signInWithGoogle, signInWithGitHub } = useBetterAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="border-4 border-foreground p-8 bg-background">
            <h2 className="text-3xl font-black mb-6 text-center">LOGIN</h2>
            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full bg-foreground text-background px-6 py-3 text-lg font-black hover:bg-background hover:text-foreground border-4 border-foreground transition-none flex items-center justify-center gap-3"
              >
                <Chrome size={20} />
                SIGN IN WITH GOOGLE
              </button>
              <button
                onClick={signInWithGitHub}
                className="w-full bg-foreground text-background px-6 py-3 text-lg font-black hover:bg-background hover:text-foreground border-4 border-foreground transition-none flex items-center justify-center gap-3"
              >
                <Github size={20} />
                SIGN IN WITH GITHUB
              </button>
            </div>
            <div className="mt-6 text-center text-sm font-bold">
              NO EMAIL/PASSWORD REQUIRED • JUST SOCIAL LOGIN
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
