"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Music, User } from "lucide-react"
import { getUserData, getAllLives } from "@/lib/actions"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLivesPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [lives, setLives] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()

        if (!user || user.type !== "admin") {
          router.push("/admin/login")
          return
        }

        setUserData(user)

        const livesData = await getAllLives()
        setLives(livesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const filteredLives = lives.filter((live) => {
    const matchesSearch =
      live.composer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      live.singer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      live.id.toString().includes(searchTerm)

    const matchesStatus = paymentStatus === "all" || live.payment_status === paymentStatus

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData || userData.type !== "admin") {
    return null // Redirect handled in useEffect
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <header className="px-6 h-16 flex items-center border-b">
          <h1 className="text-xl font-bold">Lives</h1>
        </header>

        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Gerenciar Lives</h2>
            <p className="text-gray-500">Visualize e gerencie as lives da plataforma</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Filtre as lives por nome ou status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar por compositor, cantor ou ID"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/4">
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="completed">Pagas</SelectItem>
                      <SelectItem value="cancelled">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Lives</CardTitle>
              <CardDescription>{filteredLives.length} lives encontradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Compositor</th>
                      <th className="text-left py-3 px-4">Cantor</th>
                      <th className="text-left py-3 px-4">Data</th>
                      <th className="text-left py-3 px-4">Valor</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLives.length > 0 ? (
                      filteredLives.map((live) => (
                        <tr key={live.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{live.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Music className="h-4 w-4 text-gray-500" />
                              {live.composer_name}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {live.singer_name ? (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                {live.singer_name}
                              </div>
                            ) : (
                              <span className="text-gray-500">Não agendado</span>
                            )}
                          </td>
                          <td className="py-3 px-4">{new Date(live.date).toLocaleString()}</td>
                          <td className="py-3 px-4">R$ {live.price.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                live.payment_status === "completed"
                                  ? "success"
                                  : live.payment_status === "cancelled"
                                    ? "destructive"
                                    : "default"
                              }
                            >
                              {live.payment_status === "completed"
                                ? "Paga"
                                : live.payment_status === "cancelled"
                                  ? "Cancelada"
                                  : "Pendente"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/lives/${live.id}`}>Detalhes</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-500">
                          Nenhuma live encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

