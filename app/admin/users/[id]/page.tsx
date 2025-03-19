"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Calendar, Music2, Star } from "lucide-react"
import { getUserData, getUserById, getScheduledLives } from "@/lib/actions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [adminData, setAdminData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userLives, setUserLives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const admin = await getUserData()

        if (!admin || admin.type !== "admin") {
          router.push("/login")
          return
        }

        setAdminData(admin)

        // Simular busca de dados do usuário
        const user = await getUserById(id)
        setUserData(user)

        // Simular busca de lives do usuário
        const lives = await getScheduledLives()
        // Filtrar lives relacionadas ao usuário
        const filteredLives = lives.filter(
          (live) => live.composer_id.toString() === id || live.singer_id.toString() === id,
        )
        setUserLives(filteredLives)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  // Obter as iniciais do nome para o avatar fallback
  const getInitials = (name) => {
    if (!name) return "AU"

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-spotify-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
      </div>
    )
  }

  if (!adminData || adminData.type !== "admin") {
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

  if (!userData) {
    return (
      <div className="flex min-h-screen bg-spotify-black">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center mb-6">
            <Link href="/admin/users" className="text-spotify-text hover:text-spotify-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-spotify-white">Usuário não encontrado</h1>
          </div>
          <Card className="music-card">
            <CardContent className="p-8 text-center">
              <p className="text-spotify-text mb-4">O usuário solicitado não foi encontrado ou não existe.</p>
              <Button className="bg-spotify hover:bg-spotify-dark text-black" asChild>
                <Link href="/admin/users">Voltar para Lista de Usuários</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-spotify-black">
      <AdminSidebar />
      <div className="flex-1">
        <header className="px-6 h-16 flex items-center border-b border-spotify-lightgray">
          <Link href="/admin/users" className="text-spotify-text hover:text-spotify-white mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-spotify-white">Detalhes do Usuário</h1>
        </header>

        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-spotify-white">Perfil de {userData.name}</h2>
            <p className="text-spotify-text">Detalhes completos do usuário</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="music-card">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-spotify-white">Informações Pessoais</CardTitle>
                  <Badge
                    variant={
                      userData.type === "admin" ? "destructive" : userData.type === "composer" ? "default" : "secondary"
                    }
                    className={
                      userData.type === "admin"
                        ? "bg-red-900 text-red-300"
                        : userData.type === "composer"
                          ? "bg-spotify text-black"
                          : "bg-purple-900 text-purple-300"
                    }
                  >
                    {userData.type === "composer" ? "Compositor" : userData.type === "singer" ? "Cantor" : "Admin"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 border-2 border-spotify mb-4">
                    <AvatarImage src={userData.profileImage} alt={userData.name} />
                    <AvatarFallback className="bg-gradient-to-r from-gradient-start to-gradient-end text-white text-2xl">
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-spotify-white">{userData.name}</h3>
                  <div className="flex items-center text-spotify-text mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{userData.email}</span>
                  </div>
                  {userData.rating > 0 && (
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-spotify-white">{userData.rating.toFixed(1)}</span>
                      <span className="text-xs text-spotify-text ml-1">({userData.reviewCount} avaliações)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-spotify-white">Cadastrado em</h4>
                    <div className="flex items-center text-sm text-spotify-text">
                      <Calendar className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
                      <span>{format(new Date(userData.created_at || new Date()), "PPP", { locale: ptBR })}</span>
                    </div>
                  </div>

                  {userData.genres && userData.genres.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-spotify-white">Gêneros Musicais</h4>
                      <div className="flex flex-wrap gap-1">
                        {userData.genres.map((genre, index) => (
                          <Badge key={index} variant="outline" className="text-xs py-0 border-spotify/50 text-spotify">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {userData.bio && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-spotify-white">Biografia</h4>
                      <p className="text-sm text-spotify-text">{userData.bio}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-spotify hover:bg-spotify-dark text-black">Editar Usuário</Button>
              </CardFooter>
            </Card>

            <div className="md:col-span-2">
              <Card className="music-card mb-6">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Lives</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">{userLives.length}</p>
                      <p className="text-sm text-spotify-text">Total de lives</p>
                    </div>

                    {userData.type === "composer" && (
                      <div className="p-4 bg-spotify-gray rounded-lg">
                        <h3 className="text-lg font-bold text-spotify-white">Composições</h3>
                        <p className="text-3xl font-bold text-spotify mt-2">{userData.compositions?.length || 0}</p>
                        <p className="text-sm text-spotify-text">Total de composições</p>
                      </div>
                    )}

                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Avaliação</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">{userData.rating?.toFixed(1) || "N/A"}</p>
                      <p className="text-sm text-spotify-text">{userData.reviewCount || 0} avaliações</p>
                    </div>

                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Receita</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">
                        R$ {(userLives.reduce((acc, live) => acc + (live.price || 0), 0) * 0.85).toFixed(2)}
                      </p>
                      <p className="text-sm text-spotify-text">Total recebido</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="lives">
                <TabsList className="bg-spotify-lightgray">
                  <TabsTrigger value="lives" className="data-[state=active]:bg-spotify data-[state=active]:text-black">
                    Lives
                  </TabsTrigger>
                  {userData.type === "composer" && (
                    <TabsTrigger
                      value="compositions"
                      className="data-[state=active]:bg-spotify data-[state=active]:text-black"
                    >
                      Composições
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="lives" className="mt-4">
                  <Card className="music-card">
                    <CardHeader>
                      <CardTitle className="text-spotify-white">Lives do Usuário</CardTitle>
                      <CardDescription className="text-spotify-text">
                        Histórico de lives realizadas ou agendadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userLives.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-spotify-lightgray">
                                <th className="text-left py-2 px-2 text-spotify-white">ID</th>
                                <th className="text-left py-2 px-2 text-spotify-white">Data</th>
                                <th className="text-left py-2 px-2 text-spotify-white">
                                  {userData.type === "composer" ? "Cantor" : "Compositor"}
                                </th>
                                <th className="text-left py-2 px-2 text-spotify-white">Valor</th>
                                <th className="text-left py-2 px-2 text-spotify-white">Status</th>
                                <th className="text-left py-2 px-2 text-spotify-white">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userLives.map((live) => (
                                <tr
                                  key={live.id}
                                  className="border-b border-spotify-lightgray hover:bg-spotify-lightgray"
                                >
                                  <td className="py-2 px-2 text-spotify-white">{live.id}</td>
                                  <td className="py-2 px-2 text-spotify-white">
                                    {format(new Date(live.date), "dd/MM/yyyy HH:mm")}
                                  </td>
                                  <td className="py-2 px-2 text-spotify-white">
                                    {userData.type === "composer" ? live.singer?.name : live.composer?.name}
                                  </td>
                                  <td className="py-2 px-2 text-spotify-white">R$ {live.price?.toFixed(2)}</td>
                                  <td className="py-2 px-2">
                                    <Badge
                                      variant={live.payment_status === "completed" ? "success" : "default"}
                                      className={
                                        live.payment_status === "completed"
                                          ? "bg-green-900 text-green-300"
                                          : "bg-yellow-900 text-yellow-300"
                                      }
                                    >
                                      {live.payment_status === "completed" ? "Pago" : "Pendente"}
                                    </Badge>
                                  </td>
                                  <td className="py-2 px-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-spotify text-spotify hover:bg-spotify/10"
                                      asChild
                                    >
                                      <Link href={`/admin/lives/${live.id}`}>Detalhes</Link>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-spotify-text">Nenhuma live encontrada para este usuário</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                {userData.type === "composer" && (
                  <TabsContent value="compositions" className="mt-4">
                    <Card className="music-card">
                      <CardHeader>
                        <CardTitle className="text-spotify-white">Composições</CardTitle>
                        <CardDescription className="text-spotify-text">
                          Composições criadas por este compositor
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {userData.compositions && userData.compositions.length > 0 ? (
                          <div className="space-y-4">
                            {userData.compositions.map((composition) => (
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
                            <p className="text-spotify-text">Nenhuma composição encontrada para este compositor</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" className="border-spotify text-spotify hover:bg-spotify/10" asChild>
              <Link href="/admin/users">Voltar para Lista de Usuários</Link>
            </Button>
            <div className="space-x-2">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                Desativar Conta
              </Button>
              <Button className="bg-spotify hover:bg-spotify-dark text-black">Salvar Alterações</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

