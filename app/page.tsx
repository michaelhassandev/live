import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MusicIcon, UserIcon, Calendar, Star, Headphones, Mic2, Music2, Users } from "lucide-react"
import { MainNav } from "@/components/main-nav"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-gradient-purple/30 via-spotify-black to-spotify-black -z-10"></div>

          {/* Music pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-music-pattern -z-10"></div>

          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl gradient-text">
                    Conectando Compositores e Cantores
                  </h1>
                  <p className="max-w-[600px] text-spotify-text md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Audição é a plataforma que conecta compositores talentosos com cantores em busca de músicas
                    originais.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register?type=composer" className="w-full">
                    <Button className="w-full h-12 text-base bg-spotify hover:bg-spotify-dark text-black">
                      Sou Compositor
                    </Button>
                  </Link>
                  <Link href="/register?type=singer" className="w-full">
                    <Button className="w-full h-12 text-base bg-transparent border border-spotify text-spotify hover:bg-spotify/10">
                      Sou Cantor
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex justify-center">
                <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
                  {/* Círculos animados */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-start to-gradient-end opacity-20 animate-pulse-slow"></div>
                  <div
                    className="absolute inset-4 rounded-full bg-gradient-to-r from-gradient-mid to-gradient-end opacity-30 animate-pulse-slow"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute inset-8 rounded-full bg-gradient-to-r from-gradient-end to-gradient-start opacity-40 animate-pulse-slow"
                    style={{ animationDelay: "2s" }}
                  ></div>

                  {/* Círculo central com ícone */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-32 w-32 rounded-full bg-spotify flex items-center justify-center">
                      <MusicIcon className="h-16 w-16 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 bg-spotify-gray">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">Como Funciona</h2>
                <p className="max-w-[900px] text-spotify-text md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conectamos compositores e cantores através de lives interativas, permitindo colaborações musicais
                  únicas.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gradient-start to-gradient-mid">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Crie seu Perfil</h3>
                  <p className="text-spotify-text">
                    Cadastre-se como compositor ou cantor e crie seu perfil personalizado.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gradient-mid to-gradient-end">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Agende Lives</h3>
                  <p className="text-spotify-text">
                    Compositores e cantores podem agendar lives privadas para apresentação de músicas.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gradient-end to-gradient-start">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Colabore</h3>
                  <p className="text-spotify-text">
                    Cantores podem escolher composições para gravar, criando oportunidades para ambos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-spotify-black">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">Recursos Exclusivos</h2>
                <p className="max-w-[900px] text-spotify-text md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tudo o que você precisa para encontrar a música perfeita
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="music-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify mb-4">
                  <Headphones className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Videoconferência em Tempo Real</h3>
                <p className="text-spotify-text">
                  Conecte-se diretamente com compositores ou cantores através de nossa plataforma de videoconferência
                  integrada.
                </p>
              </div>

              <div className="music-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify mb-4">
                  <Mic2 className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Compartilhamento de Áudio</h3>
                <p className="text-spotify-text">
                  Compartilhe suas composições com qualidade de áudio profissional durante as lives.
                </p>
              </div>

              <div className="music-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify mb-4">
                  <Music2 className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Catálogo de Composições</h3>
                <p className="text-spotify-text">
                  Organize suas composições em um catálogo digital profissional para apresentar aos cantores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Interaction Section */}
        <section className="w-full py-12 md:py-24 bg-spotify-gray">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">Comunidade Criativa</h2>
                <p className="max-w-[900px] text-spotify-text md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Uma plataforma que conecta talentos e promove colaborações musicais
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="music-card overflow-hidden">
                <div className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify mb-4">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Networking Musical</h3>
                  <p className="text-spotify-text">
                    Conectamos compositores e cantores com interesses similares, criando uma rede de contatos
                    profissionais no meio musical. Encontre parceiros ideais para seus projetos e amplie seu alcance
                    artístico.
                  </p>
                </div>
              </div>

              <div className="music-card overflow-hidden">
                <div className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify mb-4">
                    <MusicIcon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Direitos Autorais</h3>
                  <p className="text-spotify-text">
                    Todos os direitos autorais permanecem com o compositor. As colaborações são formalizadas através de
                    acordos claros durante as lives, garantindo segurança jurídica para ambas as partes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-spotify-lightgray py-6 px-4 md:px-6 bg-spotify-black">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
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

