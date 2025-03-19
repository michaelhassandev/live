"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MusicIcon, ArrowLeft, ShieldAlert } from "lucide-react"
import { loginUser } from "@/lib/actions"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const result = await loginUser(formData)

      if (result.success) {
        router.push("/admin")
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (error) {
      setError("Email ou senha incorretos")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-spotify-black">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-spotify-lightgray">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center">
            <MusicIcon className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-spotify-white">Audição</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-spotify-darkgray border-spotify-lightgray">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-6 w-6 text-spotify" />
              <CardTitle className="text-spotify-white">Login Administrativo</CardTitle>
            </div>
            <CardDescription className="text-spotify-text">Entre com suas credenciais de administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-spotify-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@audicao.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-spotify-white">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-spotify hover:bg-spotify-dark text-black">
                Entrar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="text-sm text-spotify-text flex items-center gap-1 hover:text-spotify-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar para a página inicial
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

