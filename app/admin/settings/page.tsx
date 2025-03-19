"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { getUserData, getAppSettings, updateAppSettings } from "@/lib/actions"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [settings, setSettings] = useState({
    mercadopago_api_key: "",
    mercadopago_client_id: "",
    mercadopago_client_secret: "",
    default_live_price: "100.00",
    site_name: "Audição",
    contact_email: "contato@audicao.com",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()

        if (!user || user.type !== "admin") {
          router.push("/login")
          return
        }

        setUserData(user)

        const settingsData = await getAppSettings()
        setSettings(settingsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    setError("")
    setSaving(true)

    try {
      await updateAppSettings(settings)
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      setError("Erro ao salvar configurações. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

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
          <h1 className="text-xl font-bold text-spotify-white">Configurações</h1>
        </header>

        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-spotify-white">Configurações do Sistema</h2>
            <p className="text-spotify-text">Gerencie as configurações da plataforma</p>
          </div>

          {success && (
            <Alert className="mb-6 bg-green-900/20 border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertTitle className="text-green-400">Sucesso!</AlertTitle>
              <AlertDescription className="text-green-400">As configurações foram salvas com sucesso.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-400">Erro</AlertTitle>
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="payment">
            <TabsList className="mb-4 bg-spotify-lightgray">
              <TabsTrigger value="payment" className="data-[state=active]:bg-spotify data-[state=active]:text-black">
                Pagamento
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-spotify data-[state=active]:text-black">
                Preços
              </TabsTrigger>
              <TabsTrigger value="general" className="data-[state=active]:bg-spotify data-[state=active]:text-black">
                Geral
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payment">
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Configurações de Pagamento</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Configure a integração com o Mercado Pago
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mercadopago_api_key" className="text-spotify-white">
                        Chave de API (Access Token)
                      </Label>
                      <Input
                        id="mercadopago_api_key"
                        name="mercadopago_api_key"
                        placeholder="APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000"
                        value={settings.mercadopago_api_key}
                        onChange={handleChange}
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                      />
                      <p className="text-xs text-spotify-text">
                        Chave de acesso para a API do Mercado Pago. Encontre em Mercado Pago &gt; Desenvolvedores &gt;
                        Credenciais de produção.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mercadopago_client_id" className="text-spotify-white">
                        Client ID
                      </Label>
                      <Input
                        id="mercadopago_client_id"
                        name="mercadopago_client_id"
                        placeholder="0000000000000000"
                        value={settings.mercadopago_client_id}
                        onChange={handleChange}
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mercadopago_client_secret" className="text-spotify-white">
                        Client Secret
                      </Label>
                      <Input
                        id="mercadopago_client_secret"
                        name="mercadopago_client_secret"
                        type="password"
                        placeholder="••••••••••••••••••••••••••••••"
                        value={settings.mercadopago_client_secret}
                        onChange={handleChange}
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    form="payment-form"
                    disabled={saving}
                    className="bg-spotify hover:bg-spotify-dark text-black"
                  >
                    {saving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Configurações de Preços</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Configure os preços das lives e comissões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="pricing-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default_live_price" className="text-spotify-white">
                        Valor Padrão da Live (R$)
                      </Label>
                      <Input
                        id="default_live_price"
                        name="default_live_price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="100.00"
                        value={settings.default_live_price}
                        onChange={handleChange}
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                      />
                      <p className="text-xs text-spotify-text">
                        Valor padrão cobrado para todas as lives na plataforma.
                      </p>
                    </div>

                    <div className="p-4 bg-spotify-lightgray rounded-md">
                      <h3 className="font-medium mb-2 text-spotify-white">Informações sobre Pagamentos</h3>
                      <p className="text-sm text-spotify-text mb-2">
                        Todos os pagamentos são feitos diretamente para a plataforma Audição. Os compositores e cantores
                        não recebem pagamentos diretamente.
                      </p>
                      <p className="text-sm text-spotify-text">
                        O valor definido acima será cobrado do cantor antes de cada live.
                      </p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    form="pricing-form"
                    disabled={saving}
                    className="bg-spotify hover:bg-spotify-dark text-black"
                  >
                    {saving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="general">
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Configurações Gerais</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Configure informações básicas da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="general-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_name" className="text-spotify-white">
                        Nome do Site
                      </Label>
                      <Input
                        id="site_name"
                        name="site_name"
                        placeholder="Audição"
                        value={settings.site_name}
                        onChange={handleChange}
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email" className="text-spotify-white">
                        Email de Contato
                      </Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        placeholder="contato@audicao.com"
                        value={settings.contact_email}
                        onChange={handleChange}
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                      />
                      <p className="text-xs text-spotify-text">Email exibido para usuários entrarem em contato.</p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    form="general-form"
                    disabled={saving}
                    className="bg-spotify hover:bg-spotify-dark text-black"
                  >
                    {saving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

