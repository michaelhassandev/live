"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MusicIcon, Calendar, Clock, User, LogOut, Menu, Plus, LayoutDashboard, Music2, Heart } from "lucide-react"
import { getUserData, getScheduledLives, logoutUser } from "@/lib/actions"
import { LiveCard } from "@/components/live-card"
import { ProfileCard } from "@/components/profile-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardPage() {
  const [userData, setUserData] = useState(null)
  const [lives, setLives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        setUserData(user)

        if (user) {
          const livesData = await getScheduledLives()
          setLives(livesData || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Erro ao carregar dados. Por favor, tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-spotify-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-spotify-black">
        <Card className="w-full max-w-md bg-spotify-darkgray border-spotify-lightgray">
          <CardHeader>
            <CardTitle className="text-spotify-white">Acesso Negado</CardTitle>
            <CardDescription className="text-spotify-text">
              Você precisa estar logado para acessar esta página
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full h-12 text-base bg-spotify hover:bg-spotify-dark text-black">Fazer Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-spotify-black">
      {/* Sidebar para desktop */}
      <div className="hidden md:block">
        <DashboardSidebar userType={userData.type} userName={userData.name} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 md:ml-64">
        {/* Header para mobile */}
        <header className="md:hidden px-4 h-16 flex items-center border-b border-spotify-lightgray sticky top-0 bg-spotify-black z-10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center">
              <MusicIcon className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold">Audição</span>
          </Link>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden ml-auto">
              <Button variant="ghost" size="icon" className="text-spotify-text">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[250px] sm:w-[300px] bg-spotify-darkgray border-spotify-lightgray p-0"
            >
              <div className="h-16 border-b border-spotify-lightgray flex items-center px-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center">
                    <MusicIcon className="h-5 w-5 text-black" />
                  </div>
                  <span className="text-xl font-bold">Audição</span>
                </Link>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gradient-start to-gradient-end flex items-center justify-center">
                    <span className="text-white font-bold">{userData.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-xs text-spotify-text capitalize">{userData.type}</p>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-1 p-2">
                <Link href="/dashboard" className="sidebar-item active">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/schedule" className="sidebar-item">
                  <Calendar className="h-5 w-5" />
                  <span>{userData.type === "composer" ? "Criar Live" : "Agendar Live"}</span>
                </Link>
                <Link href="/history" className="sidebar-item">
                  <Clock className="h-5 w-5" />
                  <span>Histórico</span>
                </Link>
                {userData.type === "composer" ? (
                  <Link href="/compositions" className="sidebar-item">
                    <Music2 className="h-5 w-5" />
                    <span>Composições</span>
                  </Link>
                ) : (
                  <Link href="/favorites" className="sidebar-item">
                    <Heart className="h-5 w-5" />
                    <span>Favoritos</span>
                  </Link>
                )}
                <Link href="/profile" className="sidebar-item">
                  <User className="h-5 w-5" />
                  <span>Perfil</span>
                </Link>
                <form action={logoutUser}>
                  <button type="submit" className="sidebar-item w-full text-left">
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </form>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="py-6 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold gradient-text">Olá, {userData.name}</h1>
              <p className="text-spotify-text">
                Bem-vindo ao seu painel de {userData.type === "composer" ? "compositor" : "cantor"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <ProfileCard user={userData} />
              <Card className="col-span-1 md:col-span-1 lg:col-span-2 music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Button className="h-16 md:h-20 text-lg bg-spotify hover:bg-spotify-dark text-black" asChild>
                    <Link href="/schedule" className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      {userData.type === "composer" ? "Criar Nova Live" : "Buscar Compositores"}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 md:h-20 text-lg border-spotify text-spotify hover:bg-spotify/10"
                    asChild
                  >
                    <Link
                      href={userData.type === "composer" ? "/compositions" : "/favorites"}
                      className="flex items-center gap-2"
                    >
                      {userData.type === "composer" ? <Music2 className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                      {userData.type === "composer" ? "Gerenciar Composições" : "Músicas Favoritas"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {error && (
              <Card className="mb-8 music-card border-red-500">
                <CardContent className="p-4">
                  <p className="text-red-400">{error}</p>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="upcoming" className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h2 className="text-xl font-bold gradient-text">Suas Lives</h2>
                <TabsList className="w-full sm:w-auto bg-spotify-lightgray">
                  <TabsTrigger
                    value="upcoming"
                    className="flex-1 sm:flex-initial data-[state=active]:bg-spotify data-[state=active]:text-black"
                  >
                    Próximas
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="flex-1 sm:flex-initial data-[state=active]:bg-spotify data-[state=active]:text-black"
                  >
                    Realizadas
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="upcoming" className="mt-0">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lives && lives.filter((live) => new Date(live.date) > new Date()).length > 0 ? (
                    lives
                      .filter((live) => new Date(live.date) > new Date())
                      .map((live) => <LiveCard key={live.id} live={live} userType={userData.type} />)
                  ) : (
                    <div className="col-span-full text-center py-12 music-card">
                      <p className="text-spotify-text mb-4">Você não tem lives agendadas</p>
                      <Button className="bg-spotify hover:bg-spotify-dark text-black" asChild>
                        <Link href="/schedule" className="flex items-center gap-2">
                          <Plus className="h-5 w-5" />
                          {userData.type === "composer" ? "Criar Nova Live" : "Buscar Compositores"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="past" className="mt-0">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lives && lives.filter((live) => new Date(live.date) <= new Date()).length > 0 ? (
                    lives
                      .filter((live) => new Date(live.date) <= new Date())
                      .map((live) => <LiveCard key={live.id} live={live} userType={userData.type} isPast />)
                  ) : (
                    <div className="col-span-full text-center py-12 music-card">
                      <p className="text-spotify-text">Você ainda não realizou nenhuma live</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <footer className="border-t border-spotify-lightgray py-4 px-4 md:px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-full bg-spotify flex items-center justify-center">
                <MusicIcon className="h-3 w-3 text-black" />
              </div>
              <p className="text-xs text-spotify-text">© 2024 Audição. Todos os direitos reservados.</p>
            </div>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-xs text-spotify-text hover:text-spotify-white transition-colors">
                Termos de Serviço
              </Link>
              <Link href="#" className="text-xs text-spotify-text hover:text-spotify-white transition-colors">
                Política de Privacidade
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  )
}

