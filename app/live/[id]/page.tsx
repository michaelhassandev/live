"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MusicIcon, ArrowLeft, Send, Music2, Video } from "lucide-react"
import { getLiveSession, getUserData, getCompositions, selectComposition } from "@/lib/actions"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { VideoConference } from "@/components/video-conference"
import { AudioShare } from "@/components/audio-share"
import { SessionRecorder } from "@/components/session-recorder"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LivePage() {
  const params = useParams()
  const { id } = params
  const [liveData, setLiveData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [compositions, setCompositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, completed
  const [selectedTab, setSelectedTab] = useState("video")
  const [liveStream, setLiveStream] = useState(null)
  const chatRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        const live = await getLiveSession(id)

        setUserData(user)
        setLiveData(live)

        if (user && user.type === "composer") {
          const comps = await getCompositions(user.id)
          setCompositions(comps)
        }

        // Simulate initial messages
        setMessages([
          {
            id: 1,
            sender: "system",
            text: "Bem-vindo à sala de live! Aguardando o início da sessão.",
            timestamp: new Date().toISOString(),
          },
        ])

        // Simulate payment check
        if (live && live.payment_status === "completed") {
          setPaymentStatus("completed")
          setMessages((prev) => [
            ...prev,
            {
              id: 2,
              sender: "system",
              text: "Pagamento confirmado! A live pode começar.",
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Simulate payment confirmation after 10 seconds if in pending state
    const timer = setTimeout(() => {
      if (paymentStatus === "pending") {
        setPaymentStatus("completed")
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random(),
            sender: "system",
            text: "Pagamento confirmado! A live pode começar.",
            timestamp: new Date().toISOString(),
          },
        ])
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [id, paymentStatus])

  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: Math.random(),
      sender: userData.type,
      text: message,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate response if appropriate
    if (userData.type === "singer" && message.toLowerCase().includes("gostei")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random(),
            sender: "composer",
            text: "Obrigado! Fico feliz que tenha gostado. Quer ouvir mais alguma composição?",
            timestamp: new Date().toISOString(),
          },
        ])
      }, 2000)
    }
  }

  const handleSelectComposition = async (compositionId) => {
    try {
      await selectComposition(liveData.id, compositionId)

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random(),
          sender: "system",
          text: "Composição selecionada com sucesso! Os detalhes foram enviados para ambos.",
          timestamp: new Date().toISOString(),
        },
      ])

      alert("Composição selecionada com sucesso!")
    } catch (error) {
      alert("Erro ao selecionar composição. Tente novamente.")
    }
  }

  const handleStreamAvailable = (stream) => {
    setLiveStream(stream)
  }

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

  if (!userData || !liveData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-spotify-black">
        <Card className="w-full max-w-md bg-spotify-darkgray border-spotify-lightgray">
          <CardHeader>
            <CardTitle className="text-spotify-white">Acesso Negado</CardTitle>
            <CardDescription className="text-spotify-text">
              Você não tem permissão para acessar esta live
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-spotify hover:bg-spotify-dark text-black">Voltar ao Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const otherUser = userData.type === "composer" ? liveData.singer : liveData.composer

  return (
    <div className="flex min-h-screen flex-col bg-spotify-black">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-spotify-lightgray sticky top-0 bg-spotify-black z-10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center">
            <MusicIcon className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold">Audição</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-spotify-text hover:text-spotify-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Sair da Live
          </Link>
        </div>
      </header>

      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-3/4">
              {paymentStatus === "pending" && userData.type === "singer" ? (
                <Card className="mb-4 music-card">
                  <CardHeader>
                    <CardTitle className="text-spotify-white">Pagamento Pendente</CardTitle>
                    <CardDescription className="text-spotify-text">
                      Para iniciar a live com {liveData.composer.name}, realize o pagamento via PIX
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <QRCodeDisplay
                      value={`00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426655440000520400005303986540${liveData.price.toFixed(2).replace(".", "")}5802BR5913AUDICAO APP6008SAOPAULO62070503***6304E2CA`}
                    />
                    <p className="mt-4 text-center text-spotify-white">Valor: R$ {liveData.price.toFixed(2)}</p>
                    <p className="text-sm text-spotify-text text-center mt-2">
                      O pagamento é processado pela plataforma Audição via Mercado Pago
                    </p>
                    <div className="flex items-center justify-center mt-4">
                      <img src="/placeholder.svg?height=24&width=120" alt="Mercado Pago" className="h-6 mr-2" />
                      <span className="text-sm text-spotify-text">Pagamento processado por Mercado Pago</span>
                    </div>
                    <div className="mt-4 p-4 bg-spotify-lightgray rounded-lg">
                      <p className="text-sm text-spotify-text text-center">
                        <strong>Importante:</strong> O pagamento é feito para a plataforma Audição. Os compositores não
                        recebem pagamentos diretamente.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
                    <TabsList className="w-full md:w-auto bg-spotify-lightgray">
                      <TabsTrigger
                        value="video"
                        className="flex-1 md:flex-initial data-[state=active]:bg-spotify data-[state=active]:text-black"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Vídeo
                      </TabsTrigger>
                      <TabsTrigger
                        value="compositions"
                        className="flex-1 md:flex-initial data-[state=active]:bg-spotify data-[state=active]:text-black"
                      >
                        <Music2 className="h-4 w-4 mr-2" />
                        Composições
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="video" className="mt-2">
                      <Card className="music-card overflow-hidden">
                        <CardContent className="p-0">
                          {paymentStatus === "completed" ? (
                            <VideoConference
                              liveId={id.toString()}
                              userId={userData.id.toString()}
                              userType={userData.type}
                              isHost={userData.type === "composer"}
                              onStreamAvailable={handleStreamAvailable}
                            />
                          ) : (
                            <div className="aspect-video bg-spotify-gray flex items-center justify-center">
                              <div className="text-center text-spotify-white">
                                <h3 className="text-xl font-bold mb-2">Aguardando pagamento</h3>
                                <p className="text-spotify-text">A live iniciará após a confirmação do pagamento</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="compositions" className="mt-2">
                      <Card className="music-card">
                        <CardHeader>
                          <CardTitle className="text-spotify-white">Composições Disponíveis</CardTitle>
                          <CardDescription className="text-spotify-text">
                            {userData.type === "composer"
                              ? "Suas composições disponíveis para apresentar"
                              : `Composições de ${liveData.composer.name}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {userData.type === "composer" && (
                            <div className="mb-4">
                              <AudioShare title="Compartilhar Áudio ao Vivo" />
                            </div>
                          )}

                          {userData.type === "composer" && (
                            <div className="mb-4">
                              <SessionRecorder stream={liveStream} />
                            </div>
                          )}

                          <div className="grid gap-4">
                            {compositions.length > 0 ? (
                              compositions.map((composition) => (
                                <Card
                                  key={composition.id}
                                  className="bg-spotify-gray border-spotify-lightgray overflow-hidden"
                                >
                                  <div className="flex flex-col md:flex-row">
                                    <div className="p-4 flex-1">
                                      <h3 className="font-bold text-spotify-white">{composition.title}</h3>
                                      <p className="text-sm text-spotify-text">{composition.genre}</p>
                                      <p className="mt-2 text-sm text-spotify-text">{composition.description}</p>
                                    </div>
                                    <div className="p-4 flex flex-row md:flex-col items-center gap-2 bg-spotify-lightgray">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-spotify text-spotify hover:bg-spotify/10"
                                      >
                                        <Music2 className="h-4 w-4 mr-2" />
                                        Ouvir
                                      </Button>
                                      {userData.type === "singer" && (
                                        <Button
                                          size="sm"
                                          className="w-full bg-spotify hover:bg-spotify-dark text-black"
                                          onClick={() => handleSelectComposition(composition.id)}
                                        >
                                          Selecionar
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              ))
                            ) : (
                              <div className="text-center py-8 bg-spotify-gray rounded-lg">
                                <p className="text-spotify-text">
                                  {userData.type === "composer"
                                    ? "Você ainda não cadastrou composições"
                                    : "Nenhuma composição disponível no momento"}
                                </p>
                                {userData.type === "composer" && (
                                  <Button className="mt-4 bg-spotify hover:bg-spotify-dark text-black" asChild>
                                    <Link href="/compositions">Gerenciar Composições</Link>
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>

            <div className="w-full md:w-1/4">
              <Card className="h-full flex flex-col music-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-spotify">
                      <AvatarImage src={otherUser?.profileImage} alt={otherUser?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-gradient-start to-gradient-end text-white">
                        {getInitials(otherUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-spotify-white">Chat</CardTitle>
                      <CardDescription className="text-spotify-text">Live com {otherUser?.name}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <div ref={chatRef} className="h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === userData.type ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            msg.sender === "system"
                              ? "bg-spotify-lightgray text-spotify-text text-center w-full"
                              : msg.sender === userData.type
                                ? "bg-spotify text-black"
                                : "bg-spotify-lightgray text-spotify-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          sendMessage()
                        }
                      }}
                      disabled={paymentStatus !== "completed"}
                      className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                    />
                    <Button
                      size="icon"
                      onClick={sendMessage}
                      disabled={paymentStatus !== "completed"}
                      className="bg-spotify hover:bg-spotify-dark text-black"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
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

