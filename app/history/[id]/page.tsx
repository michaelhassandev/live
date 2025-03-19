"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MusicIcon, ArrowLeft, Calendar, Clock, User, DollarSign, Music2, Download } from "lucide-react"
import { getLiveSession, getUserData, getCompositions, updateLiveNotes } from "@/lib/actions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HistoryDetailPage() {
  const params = useParams()
  const { id } = params
  const [liveData, setLiveData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [selectedCompositions, setSelectedCompositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        const live = await getLiveSession(id)

        if (!live || !user) {
          setLoading(false)
          return
        }

        setUserData(user)
        setLiveData(live)
        setNotes(live.notes || "")

        if (live.selectedCompositions?.length > 0) {
          const composerId = live.composerId
          const allCompositions = await getCompositions(composerId)
          const selected = allCompositions.filter((comp) => live.selectedCompositions.includes(comp.id))
          setSelectedCompositions(selected)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSaveNotes = async () => {
    try {
      await updateLiveNotes(id, notes)
      setIsEditingNotes(false)

      // Update local state
      setLiveData((prev) => ({
        ...prev,
        notes: notes,
      }))
    } catch (error) {
      console.error("Error updating notes:", error)
      alert("Erro ao salvar anotações. Tente novamente.")
    }
  }

  // Obter as iniciais do nome para o avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData || !liveData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar este histórico</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full h-12 text-base">Voltar ao Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const otherUser = userData.type === "composer" ? liveData.singer : liveData.composer
  const formattedDate = format(new Date(liveData.date), "PPP", { locale: ptBR })
  const formattedTime = format(new Date(liveData.date), "HH:mm")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background z-10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <MusicIcon className="h-6 w-6" />
          <span className="text-xl font-bold">Audição</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/history"
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao Histórico</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Detalhes da Live</h1>
            <p className="text-gray-500">Live realizada em {formattedDate}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informações da Live</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={otherUser.profileImage} alt={otherUser.name} />
                    <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">Live com {otherUser.name}</h3>
                    <p className="text-gray-500">
                      {userData.type === "composer"
                        ? `Apresentação para ${otherUser.name}`
                        : `Audição com ${otherUser.name}`}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>{formattedTime}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>{otherUser.name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>R$ {liveData.price.toFixed(2)}</span>
                  </div>
                </div>

                {userData.type === "composer" && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <h4 className="font-medium text-sm mb-1">Informações de Pagamento</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Valor total:</span> R$ {liveData.price.toFixed(2)}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Taxa da plataforma (15%):</span> R${" "}
                        {liveData.platformFee.toFixed(2)}
                      </div>
                      <div className="text-sm font-medium">
                        <span className="text-gray-500">Seu recebimento:</span> R$ {liveData.composerPayout.toFixed(2)}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Status:</span>{" "}
                        {liveData.paymentStatus === "completed" ? "Pago" : "Pendente"}
                      </div>
                    </div>
                  </div>
                )}

                {liveData.recordingUrl && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Gravação da Live</h4>
                    <Button variant="outline" size="sm" asChild>
                      <a href={liveData.recordingUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Gravação
                      </a>
                    </Button>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Anotações</h4>
                  {isEditingNotes ? (
                    <div className="space-y-2">
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Adicione anotações sobre a live..."
                        rows={4}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setNotes(liveData.notes || "")
                            setIsEditingNotes(false)
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveNotes}>Salvar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-muted rounded-md min-h-[100px] relative">
                      {liveData.notes ? (
                        <p className="text-sm">{liveData.notes}</p>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma anotação adicionada</p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setIsEditingNotes(true)}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Composições Selecionadas</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCompositions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCompositions.map((composition) => (
                      <div key={composition.id} className="p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <Music2 className="h-4 w-4 text-gray-500" />
                          <h4 className="font-medium">{composition.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{composition.genre}</p>
                        <p className="text-sm mt-2">{composition.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma composição foi selecionada</p>
                  </div>
                )}
              </CardContent>
            </Card>
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

