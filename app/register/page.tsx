"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MusicIcon, ArrowLeft } from "lucide-react"
import { registerUser } from "@/lib/actions"
import { MainNav } from "@/components/main-nav"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "composer"

  const [userType, setUserType] = useState(defaultType)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    try {
      await registerUser({
        ...formData,
        type: userType,
      })
      router.push("/dashboard")
    } catch (error) {
      setError("Erro ao criar conta. Tente novamente.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 flex items-center justify-center p-4 pt-16">
        <Card className="w-full max-w-md bg-spotify-darkgray border-spotify-lightgray">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-spotify flex items-center justify-center">
                <MusicIcon className="h-6 w-6 text-black" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Criar Conta</CardTitle>
            <CardDescription className="text-center text-spotify-text">
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-type" className="text-spotify-white">
                  Tipo de Usuário
                </Label>
                <RadioGroup id="user-type" value={userType} onValueChange={setUserType} className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="composer" id="composer" className="border-spotify text-spotify" />
                    <Label htmlFor="composer" className="text-spotify-white">
                      Compositor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="singer" id="singer" className="border-spotify text-spotify" />
                    <Label htmlFor="singer" className="text-spotify-white">
                      Cantor
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-spotify-white">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-spotify-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-spotify-white">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-spotify hover:bg-spotify-dark text-black">
                Criar Conta
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-sm text-spotify-text">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-spotify hover:underline">
                Faça login
              </Link>
            </div>
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

