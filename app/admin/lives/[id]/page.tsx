"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, User, Music2, Download } from "lucide-react"
import { getUserData, getLiveSession, getPaymentLogsByLiveId } from "@/lib/actions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLiveDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [userData, setUserData] = useState(null)
  const [liveData, setLiveData] = useState(null)
  const [paymentLogs, setPaymentLogs] = useState([])
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

        // Simular busca de dados da live
        const live = await getLiveSession(id)
        setLiveData(live)

        // Simular busca de logs de pagamento
        const logs = await getPaymentLogsByLiveId(id)
        setPaymentLogs(logs || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

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

  if (!liveData) {
    return (
      <div className="flex min-h-screen bg-spotify-black">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center mb-6">
            <Link href="/admin/lives" className="text-spotify-text hover:text-spotify-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-spotify-white">Live não encontrada</h1>
          </div>
          <Card className="music-card">
            <CardContent className="p-8 text-center">
              <p className="text-spotify-text mb-4">A live solicitada não foi encontrada ou não existe.</p>
              <Button className="bg-spotify hover:bg-spotify-dark text-black" asChild>
                <Link href="/admin/lives">Voltar para Lista de Lives</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const formattedDate = format(new Date(liveData.date), "PPP", { locale: ptBR })
  const formattedTime = format(new Date(liveData.date), "HH:mm")

  // Calcular valores financeiros
  const price = liveData.price || 0
  const platformFee = price * 0.15 // 15% de taxa da plataforma
  const composerPayout = price - platformFee

  return (
    <div className="flex min-h-screen bg-spotify-black">
      <AdminSidebar />
      <div className="flex-1">
        <header className="px-6 h-16 flex items-center border-b border-spotify-lightgray">
          <Link href="/admin/lives" className="text-spotify-text hover:text-spotify-white mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-spotify-white">Detalhes da Live</h1>
        </header>

        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-spotify-white">Live #{id}</h2>
            <p className="text-spotify-text">Detalhes completos da live</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 music-card">
              <CardHeader>
                <CardTitle className="text-spotify-white">Informações da Live</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-spotify-white">
                      Live entre {liveData.composer?.name} e {liveData.singer?.name}
                    </h3>
                    <p className="text-spotify-text">
                      {liveData.composer?.name} (Compositor) e {liveData.singer?.name} (Cantor)
                    </p>
                  </div>
                  <Badge
                    variant={liveData.payment_status === "completed" ? "success" : "default"}
                    className={
                      liveData.payment_status === "completed"
                        ? "bg-green-900 text-green-300 ml-auto"
                        : "bg-yellow-900 text-yellow-300 ml-auto"
                    }
                  >
                    {liveData.payment_status === "completed" ? "Pago" : "Pendente"}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
                    <span className="text-spotify-white">{formattedDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
                    <span className="text-spotify-white">{formattedTime}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
                    <span className="text-spotify-white">Compositor: {liveData.composer?.name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
                    <span className="text-spotify-white">Cantor: {liveData.singer?.name}</span>
                  </div>
                </div>

                <div className="p-4 bg-spotify-lightgray rounded-md">
                  <h4 className="font-medium text-spotify-white mb-2">Informações de Pagamento</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="text-sm">
                      <span className="text-spotify-text">Valor total:</span>{" "}
                      <span className="text-spotify-white">R$ {price.toFixed(2)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-spotify-text">Taxa da plataforma (15%):</span>{" "}
                      <span className="text-spotify-white">R$ {platformFee.toFixed(2)}</span>
                    </div>
                    <div className="text-sm font-medium">
                      <span className="text-spotify-text">Pagamento ao compositor:</span>{" "}
                      <span className="text-spotify-white">R$ {composerPayout.toFixed(2)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-spotify-text">Status:</span>{" "}
                      <span className="text-spotify-white">
                        {liveData.payment_status === "completed" ? "Pago" : "Pendente"}
                      </span>
                    </div>
                  </div>
                </div>

                {liveData.recordingUrl && (
                  <div className="mt-4">
                    <h4 className="font-medium text-spotify-white mb-2">Gravação da Live</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-spotify text-spotify hover:bg-spotify/10"
                      asChild
                    >
                      <a href={liveData.recordingUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Gravação
                      </a>
                    </Button>
                  </div>
                )}

                {liveData.notes && (
                  <div>
                    <h4 className="font-medium text-spotify-white mb-2">Anotações</h4>
                    <div className="p-3 bg-spotify-gray rounded-md">
                      <p className="text-sm text-spotify-white">{liveData.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="music-card">
              <CardHeader>
                <CardTitle className="text-spotify-white">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" asChild>
                  <Link href={`/admin/users/${liveData.composer_id}`}>Ver Perfil do Compositor</Link>
                </Button>
                <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" asChild>
                  <Link href={`/admin/users/${liveData.singer_id}`}>Ver Perfil do Cantor</Link>
                </Button>
                {liveData.payment_status !== "completed" && (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Marcar como Pago</Button>
                )}
                <Button variant="outline" className="w-full border-spotify text-spotify hover:bg-spotify/10">
                  Editar Detalhes
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="compositions">
              <TabsList className="bg-spotify-lightgray">
                <TabsTrigger
                  value="compositions"
                  className="data-[state=active]:bg-spotify data-[state=active]:text-black"
                >
                  Composições
                </TabsTrigger>
                <TabsTrigger value="payments" className="data-[state=active]:bg-spotify data-[state=active]:text-black">
                  Histórico de Pagamentos
                </TabsTrigger>
              </TabsList>
              <TabsContent value="compositions" className="mt-4">
                <Card className="music-card">
                  <CardHeader>
                    <CardTitle className="text-spotify-white">Composições Selecionadas</CardTitle>
                    <CardDescription className="text-spotify-text">
                      Composições escolhidas durante a live
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {liveData.selectedCompositions && liveData.selectedCompositions.length > 0 ? (
                      <div className="space-y-4">
                        {liveData.selectedCompositions.map((composition) => (
                          <div key={composition.id} className="p-3 bg-spotify-gray rounded-md">
                            <div className="flex items-center gap-2">
                              <Music2 className="h-4 w-4 text-spotify" />
                              <h4 className="font-medium text-spotify-white">{composition.title}</h4>
                            </div>
                            <p className="text-xs text-spotify-text mt-1">{composition.genre}</p>
                            <p className="text-sm text-spotify-text mt-2">{composition.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-spotify-text">Nenhuma composição foi selecionada</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payments" className="mt-4">
                <Card className="music-card">
                  <CardHeader>
                    <CardTitle className="text-spotify-white">Histórico de Pagamentos</CardTitle>
                    <CardDescription className="text-spotify-text">
                      Registros de transações relacionadas a esta live
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentLogs && paymentLogs.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-spotify-lightgray">
                              <th className="text-left py-2 px-2 text-spotify-white">ID</th>
                              <th className="text-left py-2 px-2 text-spotify-white">Transação</th>
                              <th className="text-left py-2 px-2 text-spotify-white">Valor</th>
                              <th className="text-left py-2 px-2 text-spotify-white">Status</th>
                              <th className="text-left py-2 px-2 text-spotify-white">Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentLogs.map((log) => (
                              <tr key={log.id} className="border-b border-spotify-lightgray">
                                <td className="py-2 px-2 text-spotify-white">{log.id}</td>
                                <td className="py-2 px-2 text-spotify-white">{log.transaction_id}</td>
                                <td className="py-2 px-2 text-spotify-white">R$ {log.amount.toFixed(2)}</td>
                                <td className="py-2 px-2">
                                  <Badge
                                    variant={log.status === "approved" ? "success" : "default"}
                                    className={
                                      log.status === "approved"
                                        ? "bg-green-900 text-green-300"
                                        : "bg-yellow-900 text-yellow-300"
                                    }
                                  >
                                    {log.status === "approved" ? "Aprovado" : "Pendente"}
                                  </Badge>
                                </td>
                                <td className="py-2 px-2 text-spotify-white">
                                  {new Date(log.created_at).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-spotify-text">Nenhum registro de pagamento encontrado</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

