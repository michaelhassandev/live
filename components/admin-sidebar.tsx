"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MusicIcon, LayoutDashboard, Users, Calendar, DollarSign, Settings, LogOut } from "lucide-react"
import { logoutUser } from "@/lib/actions"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 hidden md:block">
      <div className="h-16 border-b flex items-center px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <MusicIcon className="h-6 w-6" />
          <span className="text-xl font-bold">Audição</span>
        </Link>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-3">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/admin")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/users"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/admin/users")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Users className="h-5 w-5" />
            <span>Usuários</span>
          </Link>

          <Link
            href="/admin/lives"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/admin/lives")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Calendar className="h-5 w-5" />
            <span>Lives</span>
          </Link>

          <Link
            href="/admin/payments"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/admin/payments")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <DollarSign className="h-5 w-5" />
            <span>Pagamentos</span>
          </Link>

          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/admin/settings")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </Link>
        </nav>
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-3">
        <form action={logoutUser}>
          <Button variant="outline" className="w-full justify-start" type="submit">
            <LogOut className="h-5 w-5 mr-2" />
            <span>Sair</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

