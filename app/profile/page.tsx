"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MusicIcon, Save, X, Plus } from "lucide-react"
import { getUserData } from "@/lib/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNav } from "@/components/main-nav"

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    genres: [],
  })
  const [newGenre, setNewGenre] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()
        setUserData(user)

        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            bio: user.bio || "",
            genres: user.genres || [],
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Erro ao carregar dados do usuário")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddGenre = () => {
    if (!newGenre.trim()) return

    if (!formData.genres.includes(newGenre)) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, newGenre],
      }))
    }

    setNewGenre("")
  }

  const handleRemoveGenre = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    try {
      // Simulação de atualização de perfil
      // Em um ambiente real, você chamaria uma função de API para atualizar o perfil

      // Atualizar dados locais
      setUserData((prev) => ({
        ...prev,
        name: formData.name,
        bio: formData.bio,
        genres: formData.genres,
      }))

      setSuccess(true)
      setIsEditing(false)

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Erro ao atualizar perfil. Tente novamente.")
    }
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
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-spotify-white">Meu Perfil</h1>
            <p className="text-spotify-text">Gerencie suas informações pessoais</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <p className="text-green-400">Perfil atualizado com sucesso!</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 music-card">
              <CardHeader>
                <CardTitle className="text-spotify-white">Foto de Perfil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 border-2 border-spotify mb-4">
                  <AvatarImage src={userData.profileImage} alt={userData.name} />
                  <AvatarFallback className="bg-gradient-to-r from-gradient-start to-gradient-end text-white text-4xl">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
                <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" disabled>
                  Alterar Foto
                </Button>
                <p className="text-xs text-spotify-text mt-2 text-center">Funcionalidade em desenvolvimento</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 music-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-spotify-white">Informações Pessoais</CardTitle>
                  <CardDescription className="text-spotify-text">
                    {isEditing ? "Edite suas informações" : "Suas informações de perfil"}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="bg-spotify hover:bg-spotify-dark text-black">
                    Editar
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-spotify-white">
                        Nome
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                          required
                        />
                      ) : (
                        <p className="text-spotify-white mt-1">{userData.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-spotify-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                        disabled
                      />
                      <p className="text-xs text-spotify-text mt-1">O email não pode ser alterado</p>
                    </div>

                    <div>
                      <Label htmlFor="type" className="text-spotify-white">
                        Tipo de Usuário
                      </Label>
                      <p className="text-spotify-white mt-1 capitalize">{userData.type}</p>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-spotify-white">
                        Biografia
                      </Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                          placeholder="Conte um pouco sobre você..."
                          rows={4}
                        />
                      ) : (
                        <p className="text-spotify-white mt-1">{userData.bio || "Nenhuma biografia adicionada"}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-spotify-white">Gêneros Musicais</Label>
                      {isEditing ? (
                        <>
                          <div className="flex gap-2 mt-2 mb-2">
                            <Input
                              value={newGenre}
                              onChange={(e) => setNewGenre(e.target.value)}
                              className="bg-spotify-lightgray border-spotify-lightgray text-spotify-white"
                              placeholder="Adicionar gênero..."
                            />
                            <Button
                              type="button"
                              onClick={handleAddGenre}
                              className="bg-spotify hover:bg-spotify-dark text-black"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.genres.map((genre) => (
                              <Badge
                                key={genre}
                                variant="outline"
                                className="text-spotify flex items-center gap-1 border-spotify/50"
                              >
                                {genre}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGenre(genre)}
                                  className="ml-1 hover:text-red-400"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                            {formData.genres.length === 0 && (
                              <p className="text-spotify-text text-sm">Nenhum gênero adicionado</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userData.genres?.map((genre) => (
                            <Badge key={genre} variant="outline" className="text-spotify border-spotify/50">
                              {genre}
                            </Badge>
                          ))}
                          {!userData.genres?.length && <p className="text-spotify-text">Nenhum gênero adicionado</p>}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setFormData({
                              name: userData.name,
                              email: userData.email,
                              bio: userData.bio || "",
                              genres: userData.genres || [],
                            })
                          }}
                          className="border-spotify text-spotify hover:bg-spotify/10"
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-spotify hover:bg-spotify-dark text-black">
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {userData.type === "composer" && (
            <div className="mt-6">
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Estatísticas</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Informações sobre suas composições e lives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Composições</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">{userData.compositions?.length || 0}</p>
                      <p className="text-sm text-spotify-text">Total de composições</p>
                    </div>
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Lives</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">0</p>
                      <p className="text-sm text-spotify-text">Lives realizadas</p>
                    </div>
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Avaliação</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">{userData.rating?.toFixed(1) || "N/A"}</p>
                      <p className="text-sm text-spotify-text">{userData.reviewCount || 0} avaliações</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" asChild>
                    <Link href="/compositions">Gerenciar Composições</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {userData.type === "singer" && (
            <div className="mt-6">
              <Card className="music-card">
                <CardHeader>
                  <CardTitle className="text-spotify-white">Estatísticas</CardTitle>
                  <CardDescription className="text-spotify-text">
                    Informações sobre suas lives e composições selecionadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Lives</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">0</p>
                      <p className="text-sm text-spotify-text">Lives realizadas</p>
                    </div>
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Composições</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">0</p>
                      <p className="text-sm text-spotify-text">Composições selecionadas</p>
                    </div>
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-lg font-bold text-spotify-white">Compositores</h3>
                      <p className="text-3xl font-bold text-spotify mt-2">0</p>
                      <p className="text-sm text-spotify-text">Compositores colaborados</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" asChild>
                    <Link href="/schedule">Agendar Nova Live</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
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

