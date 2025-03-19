"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search, Info } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { getUserData, getComposers, createLiveSession, getAppSettings } from "@/lib/actions"
import { MainNav } from "@/components/main-nav"
import { MusicIcon } from "lucide-react"

export default function SchedulePage() {
  const [userData, setUserData] = useState(null)
  const [composers, setComposers] = useState([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState("")
  const [selectedComposer, setSelectedComposer] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [genre, setGenre] = useState("")
  const [appSettings, setAppSettings] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        const composersData = await getComposers()
        const settings = await getAppSettings()

        setUserData(user)
        setComposers(composersData)
        setAppSettings(settings)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredComposers = composers.filter((composer) => {
    const matchesSearch =
      composer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      composer.genres.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesGenre = genre === "" || composer.genres.includes(genre)
    return matchesSearch && matchesGenre
  })

  const handleSchedule = async () => {
    if (!date || !time) {
      alert("Por favor, selecione data e horário")
      return
    }

    try {
      const dateTime = new Date(date)
      const [hours, minutes] = time.split(":")
      dateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))

      if (userData.type === "composer") {
        // Compositor cria um link de convite
        const result = await createLiveSession({
          composerId: userData.id,
          date: dateTime.toISOString(),
        })

        if (result.success) {
          // Redirecionar para a página de pagamento
          window.location.href = `/payment/composer/${result.liveId}`
        } else {
          throw new Error("Erro ao criar live")
        }
      } else if (userData.type === "singer") {
        // Cantores não criam lives, apenas aceitam convites
        alert("Cantores não podem criar lives. Aguarde um convite de um compositor.")
      }
    } catch (error) {
      console.error("Erro ao agendar live:", error)
      alert("Erro ao agendar live. Tente novamente.")
    }
  }

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
    <div className="flex min-h-screen flex-col bg-spotify-black">
      <MainNav userType={userData.type} />

      <main className="flex-1 py-6 px-4 md:px-6 pt-20">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold mb-6 text-spotify-white">
            {userData.type === "composer" ? "Criar Link de Convite" : "Buscar Compositores"}
          </h1>

          {userData.type === "singer" ? (
            <Card className="music-card">
              <CardHeader>
                <CardTitle className="text-spotify-white">Informação para Cantores</CardTitle>
                <CardDescription className="text-spotify-text">Como funciona o processo de agendamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-spotify-lightgray rounded-md flex items-start gap-3">
                  <Info className="h-5 w-5 text-spotify mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-spotify-white mb-1">Novo Fluxo de Agendamento</h3>
                    <p className="text-sm text-spotify-text">
                      Na plataforma Audição, os <strong>compositores</strong> são responsáveis por criar e pagar pelas
                      lives. Eles criam um link de convite que é enviado para os cantores. Como cantor, você deve
                      aguardar receber um convite de um compositor para participar de uma live.
                    </p>
                    <p className="text-sm text-spotify-text mt-2">
                      Você pode explorar os compositores abaixo para conhecer seus trabalhos, mas não é possível agendar
                      diretamente. Quando receber um convite, ele aparecerá no seu dashboard.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-spotify-white mb-2">Compositores Disponíveis</h3>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <Label htmlFor="search" className="text-spotify-white">
                        Buscar
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="search"
                          placeholder="Nome ou gênero musical"
                          className="pl-8 bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/3">
                      <Label htmlFor="genre" className="text-spotify-white">
                        Gênero Musical
                      </Label>
                      <Select value={genre} onValueChange={setGenre}>
                        <SelectTrigger
                          id="genre"
                          className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                        >
                          <SelectValue placeholder="Todos os gêneros" />
                        </SelectTrigger>
                        <SelectContent className="bg-spotify-darkgray border-spotify-lightgray text-spotify-white">
                          <SelectItem value="all">Todos os gêneros</SelectItem>
                          <SelectItem value="Pop">Pop</SelectItem>
                          <SelectItem value="Rock">Rock</SelectItem>
                          <SelectItem value="Sertanejo">Sertanejo</SelectItem>
                          <SelectItem value="MPB">MPB</SelectItem>
                          <SelectItem value="Samba">Samba</SelectItem>
                          <SelectItem value="Funk">Funk</SelectItem>
                          <SelectItem value="Rap">Rap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                    {filteredComposers.length > 0 ? (
                      filteredComposers.map((composer) => (
                        <Card
                          key={composer.id}
                          className="bg-spotify-gray border-spotify-lightgray hover:bg-spotify-lightgray transition-colors"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-spotify-white">{composer.name}</CardTitle>
                            <CardDescription className="text-spotify-text">
                              {composer.genres.join(", ")}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-spotify-text">
                                <span>
                                  Avaliação: {composer.rating.toFixed(1)} ({composer.reviewCount} avaliações)
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-spotify-text">
                                <span>{composer.compositions?.length || 0} composições</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full border-spotify text-spotify hover:bg-spotify/10"
                              disabled={true}
                            >
                              Aguarde Convite
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-spotify-gray rounded-lg">
                        <p className="text-spotify-text">Nenhum compositor encontrado</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="music-card">
              <CardHeader>
                <CardTitle className="text-spotify-white">Criar Link de Convite</CardTitle>
                <CardDescription className="text-spotify-text">
                  Configure os detalhes da live e gere um link para convidar um cantor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-spotify-lightgray rounded-md flex items-start gap-3 mb-4">
                  <Info className="h-5 w-5 text-spotify mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-spotify-white mb-1">Como Funciona</h3>
                    <p className="text-sm text-spotify-text">
                      Ao criar um link de convite, você será redirecionado para a página de pagamento. Após o pagamento,
                      você receberá um link que pode ser compartilhado com um cantor de sua escolha.
                    </p>
                    <p className="text-sm text-spotify-text mt-2">
                      O valor cobrado é de R$ {appSettings?.default_live_price || "100.00"} por live.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="date" className="text-spotify-white">
                      Data Disponível
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-spotify-lightgray border-spotify-lightgray text-spotify-white",
                            !date && "text-spotify-text",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-spotify-darkgray border-spotify-lightgray">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="bg-spotify-darkgray text-spotify-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="w-full md:w-1/3">
                    <Label htmlFor="time" className="text-spotify-white">
                      Horário
                    </Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger
                        id="time"
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                      >
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent className="bg-spotify-darkgray border-spotify-lightgray text-spotify-white">
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="11:00">11:00</SelectItem>
                        <SelectItem value="14:00">14:00</SelectItem>
                        <SelectItem value="15:00">15:00</SelectItem>
                        <SelectItem value="16:00">16:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="19:00">19:00</SelectItem>
                        <SelectItem value="20:00">20:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-spotify hover:bg-spotify-dark text-black"
                  disabled={!date || !time}
                  onClick={handleSchedule}
                >
                  Prosseguir para Pagamento
                </Button>
              </CardFooter>
            </Card>
          )}
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

