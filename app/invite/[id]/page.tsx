"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MusicIcon, ArrowLeft, Calendar, Clock, User, Music2 } from "lucide-react"
import { getUserData, getLiveSession, acceptLiveInvite } from "@/lib/actions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MainNav } from "@/components/main-nav"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [userData, setUserData] = useState(null)
  const [liveData, setLiveData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        setUserData(user)

        const live = await getLiveSession(id)
        if (!live) {
          setLoading(false)
          return
        }

        setLiveData(live)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAcceptInvite = async () => {
    if (!userData || userData.type !== "singer") {
      alert("Apenas cantores podem aceitar convites para lives")
      return
    }

    try {
      setAccepting(true)
      const result = await acceptLiveInvite(id, userData.id)

      if (result.success) {
        alert("Convite aceito com sucesso!")
        router.push("/dashboard")
      } else {
        throw new Error("Erro ao aceitar convite")
      }
    } catch (error) {
      console.error("Error accepting invite:", error)
      alert("Erro ao aceitar convite. Tente novamente.")
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-spotify-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
      </div>
    )
  }

  if (!liveData) {
    return (
      <div className="flex min-h-screen flex-col bg-spotify-black">
        <MainNav userType={userData?.type} />
        <main className="flex-1 py-6 px-4 md:px-6 pt-20">
          <div className="container mx-auto max-w-4xl">
            <Card className="music-card">
              <CardHeader>
                <CardTitle className="text-spotify-white">Convite Inválido</CardTitle>
                <CardDescription className="text-spotify-text">
                  Este convite não existe ou já foi utilizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-spotify-text">
                  O link de convite que você está tentando acessar não é válido. Verifique se o link está correto ou
                  peça ao compositor para enviar um novo convite.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" onClick={() => router.push("/")}>
                  Voltar para a Página Inicial
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const formattedDate = format(new Date(liveData.date), "PPP", { locale: ptBR })
  const formattedTime = format(new Date(liveData.date), "HH:mm")

  return (
    <div className="flex min-h-screen flex-col bg-spotify-black">
      <MainNav userType={userData?.type} />

      <main className="flex-1 py-6 px-4 md:px-6 pt-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 flex items-center">
            <Link href="/" className="text-spotify-text hover:text-spotify-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-spotify-white">Convite para Live</h1>
          </div>

          <Card className="music-card">
            <CardHeader>
              <CardTitle className="text-spotify-white">Detalhes da Live</CardTitle>
              <CardDescription className="text-spotify-text">
                Você foi convidado para uma live com {liveData.composer.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <span className="text-spotify-white">Compositor: {liveData.composer.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Music2 className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
                  <span className="text-spotify-white">
                    Gêneros: {liveData.composer.genres?.join(", ") || "Não especificado"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-spotify-lightgray rounded-md">
                <h4 className="font-medium text-spotify-white mb-2">Sobre a Live</h4>
                <p className="text-sm text-spotify-text">
                  Nesta live, o compositor apresentará suas composições originais. Você poderá interagir em tempo real,
                  fazer perguntas e selecionar músicas que deseja gravar.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              {!userData ? (
                <>
                  <Button
                    className="w-full bg-spotify hover:bg-spotify-dark text-black"
                    onClick={() => router.push("/login")}
                  >
                    Fazer Login para Aceitar
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-spotify text-spotify hover:bg-spotify/10"
                    onClick={() => router.push("/register?type=singer")}
                  >
                    Criar Conta de Cantor
                  </Button>
                </>
              ) : userData.type === "singer" ? (
                <>
                  <Button
                    className="w-full bg-spotify hover:bg-spotify-dark text-black"
                    onClick={handleAcceptInvite}
                    disabled={accepting}
                  >
                    {accepting ? "Aceitando..." : "Aceitar Convite"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-spotify text-spotify hover:bg-spotify/10"
                    onClick={() => router.push("/dashboard")}
                  >
                    Voltar para o Dashboard
                  </Button>
                </>
              ) : (
                <div className="w-full p-4 bg-yellow-900/20 border border-yellow-800 rounded-md">
                  <p className="text-yellow-300 text-center">
                    Você está logado como {userData.type === "composer" ? "compositor" : "administrador"}. Apenas
                    cantores podem aceitar convites para lives.
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t border-spotify-lightgray py-4 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
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
  )
}

