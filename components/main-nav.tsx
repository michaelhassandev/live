"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MusicIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/actions"

interface MainNavProps {
  userType?: "composer" | "singer" | "admin" | null
}

export function MainNav({ userType }: MainNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-spotify-black border-b border-spotify-lightgray z-50 px-4 lg:px-6 flex items-center">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center">
          <MusicIcon className="h-5 w-5 text-black" />
        </div>
        <span className="text-xl font-bold">Audição</span>
      </Link>

      {userType && (
        <nav className="ml-auto flex items-center gap-6">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium hover:text-spotify transition-colors",
              isActive("/dashboard") && "text-spotify",
            )}
          >
            Dashboard
          </Link>

          {userType === "composer" && (
            <Link
              href="/compositions"
              className={cn(
                "text-sm font-medium hover:text-spotify transition-colors",
                isActive("/compositions") && "text-spotify",
              )}
            >
              Composições
            </Link>
          )}

          <Link
            href="/schedule"
            className={cn(
              "text-sm font-medium hover:text-spotify transition-colors",
              isActive("/schedule") && "text-spotify",
            )}
          >
            {userType === "composer" ? "Criar Live" : "Agendar Live"}
          </Link>

          <Link
            href="/history"
            className={cn(
              "text-sm font-medium hover:text-spotify transition-colors",
              isActive("/history") && "text-spotify",
            )}
          >
            Histórico
          </Link>

          <Link
            href="/profile"
            className={cn(
              "text-sm font-medium hover:text-spotify transition-colors",
              isActive("/profile") && "text-spotify",
            )}
          >
            Perfil
          </Link>

          <form action={logoutUser}>
            <Button variant="ghost" size="icon" type="submit" className="text-spotify-text hover:text-spotify-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </nav>
      )}

      {!userType && (
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-spotify transition-colors">
            Login
          </Link>
          <Button asChild className="bg-spotify hover:bg-spotify-dark text-black">
            <Link href="/register">Cadastre-se</Link>
          </Button>
        </nav>
      )}
    </header>
  )
}

