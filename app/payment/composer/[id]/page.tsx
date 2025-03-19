"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MusicIcon, ArrowLeft, Copy, Check, Share2 } from "lucide-react"
import { getUserData, getLiveSession, checkPaymentStatus } from "@/lib/actions"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { MainNav } from "@/components/main-nav"

export default function ComposerPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [userData, setUserData] = useState(null)
  const [liveData, setLiveData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, completed
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        if (!user || user.type !== "composer") {
          router.push("/dashboard")
          return
        }

        setUserData(user)

        const live = await getLiveSession(id)
        if (!live) {
          router.push("/dashboard")
          return
        }

        setLiveData(live)

        // Gerar link de convite
        const baseUrl = window.location.origin
        setInviteLink(`${baseUrl}/invite/${id}`)

        // Verificar status de pagamento
        if (live.payment_status === "completed") {
          setPaymentStatus("completed")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  // Verificar status de pagamento a cada 5 segundos
  useEffect(() => {
    if (paymentStatus === "pending") {
      const interval = setInterval(async () => {
        try {
          setCheckingPayment(true)
          const result = await checkPaymentStatus(id)
          if (result.liveStatus === "completed") {
            setPaymentStatus("completed")
            clearInterval(interval)
          }
        } catch (error) {
          console.error("Error checking payment status:", error)
        } finally {
          setCheckingPayment(false)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [id, paymentStatus])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Convite para Live na Audição",
          text: "Participe da minha live na plataforma Audição!",
          url: inviteLink,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-spotify-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-spotify-black">
      <MainNav userType={userData?.type} />

      <main className="flex-1 py-6 px-4 md:px-6 pt-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 flex items-center">
            <Link href="/dashboard" className="text-spotify-text hover:text-spotify-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-spotify-white">Pagamento da Live</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="music-card">
              <CardHeader>
                <CardTitle className="text-spotify-white">Detalhes da Live</CardTitle>
                <CardDescription className="text-spotify-text">Informações sobre a live agendada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-spotify-white">Data e Horário</h3>
                  <p className="text-spotify-text">
                    {liveData &&
                      new Date(liveData.date).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-spotify-white">Status</h3>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      paymentStatus === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {paymentStatus === "completed" ? "Pago" : "Aguardando Pagamento"}
                    {checkingPayment && <span className="ml-2 animate-pulse">•••</span>}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-spotify-white">Valor</h3>
                  <p className="text-spotify-text">R$ {liveData?.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {paymentStatus === "pending" ? (
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Pagamento via PIX</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Escaneie o QR Code para pagar e gerar o link de convite
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <QRCodeDisplay
                    value={`00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426655440000520400005303986540${liveData?.price.toFixed(2).replace(".", "")}5802BR5913AUDICAO APP6008SAOPAULO62070503***6304E2CA`}
                  />
                  <p className="mt-4 text-center text-spotify-white">Valor: R$ {liveData?.price.toFixed(2)}</p>
                  <p className="text-sm text-spotify-text text-center mt-2">
                    O pagamento é processado pela plataforma Audição via Mercado Pago
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Link de Convite</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Compartilhe este link com o cantor para a live
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      className="border-spotify text-spotify hover:bg-spotify/10"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar Link
                  </Button>
                  <div className="p-4 bg-spotify-lightgray rounded-md">
                    <p className="text-sm text-spotify-text">
                      <strong>Importante:</strong> Este link é válido para apenas um cantor. Quando o cantor aceitar o
                      convite, a live será agendada automaticamente.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-spotify text-spotify hover:bg-spotify/10"
                    onClick={() => router.push("/dashboard")}
                  >
                    Voltar para o Dashboard
                  </Button>
                </CardFooter>
              </Card>
            )}
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

