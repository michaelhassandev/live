"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MusicIcon, ArrowLeft, Search } from "lucide-react"
import { getUserData, getScheduledLives } from "@/lib/actions"
import { LiveCard } from "@/components/live-card"

export default function HistoryPage() {
  const [userData, setUserData] = useState(null)
  const [lives, setLives] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        const livesData = await getScheduledLives()

        setUserData(user)
        setLives(livesData.filter((live) => new Date(live.date) <= new Date()))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredLives = lives.filter((live) => {
    const otherUser = userData.type === "composer" ? live.singer : live.composer
    return otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar esta página</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full h-12 text-base">Fazer Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background z-10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <MusicIcon className="h-6 w-6" />
          <span className="text-xl font-bold">Audição</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao Dashboard</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Histórico de Lives</h1>
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLives.length > 0 ? (
              filteredLives.map((live) => <LiveCard key={live.id} live={live} userType={userData.type} isPast />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhuma live realizada encontrada</p>
                <Button className="mt-4 h-12 text-base" asChild>
                  <Link href="/schedule">
                    {userData.type === "composer" ? "Criar Nova Live" : "Buscar Compositores"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t py-4 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-500">© 2024 Audição. Todos os direitos reservados.</p>
          <nav className="flex gap-4 sm:gap-6 mt-2 md:mt-0">
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Termos de Serviço
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Política de Privacidade
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

