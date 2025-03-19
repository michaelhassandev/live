"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MusicIcon, Users, Calendar, DollarSign, Settings } from "lucide-react"
import { getUserData, getAdminStats } from "@/lib/actions"
import { AdminSidebar } from "@/components/admin-sidebar"
import { StatsCard } from "@/components/stats-card"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()

        if (!user || user.type !== "admin") {
          router.push("/login")
          return
        }

        setUserData(user)

        const statsData = await getAdminStats()
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-spotify-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
      </div>
    )
  }

  if (!userData || userData.type !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-spotify-black">
        <Card className="w-full max-w-md bg-spotify-darkgray border-spotify-lightgray">
          <CardHeader>
            <CardTitle className="text-spotify-white">Acesso Negado</CardTitle>
            <CardDescription className="text-spotify-text">
              Você não tem permissão para acessar esta página
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full bg-spotify hover:bg-spotify-dark text-black">
                Fazer Login como Administrador
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-spotify-black">
      <AdminSidebar />

      <div className="flex-1">
        <header className="px-6 h-16 flex items-center border-b border-spotify-lightgray">
          <h1 className="text-xl font-bold text-spotify-white">Painel Administrativo</h1>
        </header>

        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-spotify-white">Bem-vindo, {userData.name}</h2>
            <p className="text-spotify-text">Visão geral do sistema</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatsCard
              title="Usuários"
              value={stats?.totalUsers || 0}
              description="Total de usuários"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Compositores"
              value={stats?.totalComposers || 0}
              description="Compositores cadastrados"
              icon={<MusicIcon className="h-5 w-5" />}
            />
            <StatsCard
              title="Cantores"
              value={stats?.totalSingers || 0}
              description="Cantores cadastrados"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Lives"
              value={stats?.totalLives || 0}
              description="Total de lives"
              icon={<Calendar className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card className="music-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-spotify-white">Receita</CardTitle>
                <CardDescription className="text-spotify-text">Valor total recebido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <span className="text-3xl font-bold text-spotify-white">
                    R$ {(stats?.totalRevenue || 0).toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-spotify-text">Lives Completadas</p>
                    <p className="text-xl font-medium text-spotify-white">{stats?.completedLives || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-spotify-text">Lives Pendentes</p>
                    <p className="text-xl font-medium text-spotify-white">{stats?.pendingLives || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="music-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-spotify-white">Ações Rápidas</CardTitle>
                <CardDescription className="text-spotify-text">Gerenciar o sistema</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button className="h-20 bg-spotify hover:bg-spotify-dark text-black" asChild>
                  <Link href="/admin/settings">
                    <Settings className="h-5 w-5 mb-1" />
                    <span>Configurações</span>
                  </Link>
                </Button>
                <Button className="h-20 bg-spotify hover:bg-spotify-dark text-black" asChild>
                  <Link href="/admin/users">
                    <Users className="h-5 w-5 mb-1" />
                    <span>Usuários</span>
                  </Link>
                </Button>
                <Button className="h-20 bg-spotify hover:bg-spotify-dark text-black" asChild>
                  <Link href="/admin/lives">
                    <Calendar className="h-5 w-5 mb-1" />
                    <span>Lives</span>
                  </Link>
                </Button>
                <Button className="h-20 bg-spotify hover:bg-spotify-dark text-black" asChild>
                  <Link href="/admin/payments">
                    <DollarSign className="h-5 w-5 mb-1" />
                    <span>Pagamentos</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="lives">
            <TabsList className="bg-spotify-lightgray">
              <TabsTrigger value="lives" className="data-[state=active]:bg-spotify data-[state=active]:text-black">
                Últimas Lives
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-spotify data-[state=active]:text-black">
                Últimos Pagamentos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="lives" className="mt-4">
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Lives Recentes</CardTitle>
                  <CardDescription className="text-spotify-text">As 5 lives mais recentes no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-spotify-lightgray">
                          <th className="text-left py-2 px-2 text-spotify-white">ID</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Compositor</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Cantor</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Data</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Valor</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentLives?.length > 0 ? (
                          stats.recentLives.map((live) => (
                            <tr key={live.id} className="border-b border-spotify-lightgray hover:bg-spotify-lightgray">
                              <td className="py-2 px-2 text-spotify-white">{live.id}</td>
                              <td className="py-2 px-2 text-spotify-white">{live.composer_name}</td>
                              <td className="py-2 px-2 text-spotify-white">{live.singer_name || "Não agendado"}</td>
                              <td className="py-2 px-2 text-spotify-white">{new Date(live.date).toLocaleString()}</td>
                              <td className="py-2 px-2 text-spotify-white">R$ {live.price.toFixed(2)}</td>
                              <td className="py-2 px-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    live.payment_status === "completed"
                                      ? "bg-green-900 text-green-300"
                                      : "bg-yellow-900 text-yellow-300"
                                  }`}
                                >
                                  {live.payment_status === "completed" ? "Pago" : "Pendente"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-4 text-center text-spotify-text">
                              Nenhuma live encontrada
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" className="border-spotify text-spotify hover:bg-spotify/10" asChild>
                      <Link href="/admin/lives">Ver Todas</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Pagamentos Recentes</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Os 5 pagamentos mais recentes no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-spotify-lightgray">
                          <th className="text-left py-2 px-2 text-spotify-white">ID</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Live ID</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Transação</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Valor</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Status</th>
                          <th className="text-left py-2 px-2 text-spotify-white">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentPayments?.length > 0 ? (
                          stats.recentPayments.map((payment) => (
                            <tr
                              key={payment.id}
                              className="border-b border-spotify-lightgray hover:bg-spotify-lightgray"
                            >
                              <td className="py-2 px-2 text-spotify-white">{payment.id}</td>
                              <td className="py-2 px-2 text-spotify-white">{payment.live_id}</td>
                              <td className="py-2 px-2 text-spotify-white">{payment.transaction_id}</td>
                              <td className="py-2 px-2 text-spotify-white">R$ {payment.amount.toFixed(2)}</td>
                              <td className="py-2 px-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    payment.status === "approved"
                                      ? "bg-green-900 text-green-300"
                                      : "bg-yellow-900 text-yellow-300"
                                  }`}
                                >
                                  {payment.status === "approved" ? "Aprovado" : "Pendente"}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-spotify-white">
                                {new Date(payment.created_at).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-4 text-center text-spotify-text">
                              Nenhum pagamento encontrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" className="border-spotify text-spotify hover:bg-spotify/10" asChild>
                      <Link href="/admin/payments">Ver Todos</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

