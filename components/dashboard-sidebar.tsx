"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  MusicIcon,
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Music2,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/actions"

interface DashboardSidebarProps {
  userType: "composer" | "singer" | "admin"
  userName: string
}

export function DashboardSidebar({ userType, userName }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-full bg-spotify-darkgray border-r border-spotify-lightgray transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 border-b border-spotify-lightgray flex items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center flex-shrink-0">
              <MusicIcon className="h-5 w-5 text-black" />
            </div>
            {!collapsed && <span className="text-xl font-bold">Audição</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-spotify-text hover:text-spotify-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gradient-start to-gradient-end flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">{userName.charAt(0)}</span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-medium truncate">{userName}</p>
                <p className="text-xs text-spotify-text capitalize">{userType}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            {!collapsed && <p className="text-xs text-spotify-text uppercase px-3 mb-1">Menu</p>}
            <ul className="space-y-1">
              <li>
                <Link href="/dashboard" className={cn("sidebar-item", isActive("/dashboard") && "active")}>
                  <LayoutDashboard className="h-5 w-5" />
                  {!collapsed && <span>Dashboard</span>}
                </Link>
              </li>

              <li>
                <Link href="/schedule" className={cn("sidebar-item", isActive("/schedule") && "active")}>
                  <Calendar className="h-5 w-5" />
                  {!collapsed && <span>{userType === "composer" ? "Criar Live" : "Agendar Live"}</span>}
                </Link>
              </li>

              <li>
                <Link href="/history" className={cn("sidebar-item", isActive("/history") && "active")}>
                  <Clock className="h-5 w-5" />
                  {!collapsed && <span>Histórico</span>}
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-3 mb-2">
            {!collapsed && <p className="text-xs text-spotify-text uppercase px-3 mb-1">Biblioteca</p>}
            <ul className="space-y-1">
              {userType === "composer" && (
                <li>
                  <Link href="/compositions" className={cn("sidebar-item", isActive("/compositions") && "active")}>
                    <Music2 className="h-5 w-5" />
                    {!collapsed && <span>Composições</span>}
                  </Link>
                </li>
              )}

              {userType === "singer" && (
                <li>
                  <Link href="/favorites" className={cn("sidebar-item", isActive("/favorites") && "active")}>
                    <Heart className="h-5 w-5" />
                    {!collapsed && <span>Favoritos</span>}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="px-3">
            {!collapsed && <p className="text-xs text-spotify-text uppercase px-3 mb-1">Conta</p>}
            <ul className="space-y-1">
              <li>
                <Link href="/profile" className={cn("sidebar-item", isActive("/profile") && "active")}>
                  <User className="h-5 w-5" />
                  {!collapsed && <span>Perfil</span>}
                </Link>
              </li>

              <li>
                <form action={logoutUser}>
                  <button type="submit" className="sidebar-item w-full text-left">
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span>Sair</span>}
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}

