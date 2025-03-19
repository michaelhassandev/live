"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MusicIcon, ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"
import { getUserData, getCompositions } from "@/lib/actions"

export default function CompositionsPage() {
  const [userData, setUserData] = useState(null)
  const [compositions, setCompositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentComposition, setCurrentComposition] = useState({
    id: "",
    title: "",
    genre: "",
    description: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData()

        if (user && user.type === "composer") {
          const comps = await getCompositions(user.id)
          setCompositions(comps)
          setUserData(user)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddEdit = () => {
    // In a real app, this would call a server action to save the composition
    if (isEditing) {
      // Edit existing composition
      const updatedCompositions = compositions.map((comp) =>
        comp.id === currentComposition.id ? currentComposition : comp,
      )
      setCompositions(updatedCompositions)
    } else {
      // Add new composition
      const newComposition = {
        ...currentComposition,
        id: (compositions.length + 1).toString(),
      }
      setCompositions([...compositions, newComposition])
    }

    // Reset form
    setCurrentComposition({
      id: "",
      title: "",
      genre: "",
      description: "",
    })
    setIsEditing(false)
  }

  const handleEdit = (composition) => {
    setCurrentComposition(composition)
    setIsEditing(true)
  }

  const handleDelete = (id) => {
    // In a real app, this would call a server action to delete the composition
    const updatedCompositions = compositions.filter((comp) => comp.id !== id)
    setCompositions(updatedCompositions)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData || userData.type !== "composer") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Apenas compositores podem acessar esta página</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">Voltar ao Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
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
            Voltar ao Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Minhas Composições</h1>
            <Button
              onClick={() => {
                setCurrentComposition({
                  id: "",
                  title: "",
                  genre: "",
                  description: "",
                })
                setIsEditing(false)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Composição
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Editar Composição" : "Nova Composição"}</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Atualize os detalhes da sua composição"
                    : "Adicione uma nova composição ao seu catálogo"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={currentComposition.title}
                    onChange={(e) => setCurrentComposition({ ...currentComposition, title: e.target.value })}
                    placeholder="Nome da composição"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Gênero Musical</Label>
                  <Select
                    value={currentComposition.genre}
                    onValueChange={(value) => setCurrentComposition({ ...currentComposition, genre: value })}
                  >
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Selecione um gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pop">Pop</SelectItem>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Sertanejo">Sertanejo</SelectItem>
                      <SelectItem value="MPB">MPB</SelectItem>
                      <SelectItem value="Samba">Samba</SelectItem>
                      <SelectItem value="Funk">Funk</SelectItem>
                      <SelectItem value="Rap">Rap</SelectItem>
                      <SelectItem value="Blues">Blues</SelectItem>
                      <SelectItem value="Jazz">Jazz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={currentComposition.description}
                    onChange={(e) => setCurrentComposition({ ...currentComposition, description: e.target.value })}
                    placeholder="Descreva sua composição"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentComposition({
                      id: "",
                      title: "",
                      genre: "",
                      description: "",
                    })
                    setIsEditing(false)
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddEdit} disabled={!currentComposition.title || !currentComposition.genre}>
                  {isEditing ? "Atualizar" : "Adicionar"}
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Catálogo de Composições</h2>
              {compositions.length > 0 ? (
                compositions.map((composition) => (
                  <Card key={composition.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{composition.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(composition)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(composition.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{composition.genre}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{composition.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">Você ainda não tem composições cadastradas</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Adicione sua primeira composição usando o formulário ao lado
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
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

