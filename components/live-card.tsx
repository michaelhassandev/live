import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, Play, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function LiveCard({ live, userType, isPast = false }) {
  const otherUser = userType === "composer" ? live.singer : live.composer
  const formattedDate = format(new Date(live.date), "PPP", { locale: ptBR })
  const formattedTime = format(new Date(live.date), "HH:mm")

  // Obter as iniciais do nome para o avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="music-card h-full flex flex-col hover-scale">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1 text-spotify-white">Live com {otherUser.name}</CardTitle>
          <Badge
            variant={isPast ? "outline" : "default"}
            className="ml-2 whitespace-nowrap bg-spotify text-black border-spotify"
          >
            {isPast ? "Realizada" : "Agendada"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-1 text-spotify-text">
          {userType === "composer" ? `Apresentação para ${otherUser.name}` : `Audição com ${otherUser.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-spotify">
            <AvatarImage src={otherUser.profileImage} alt={otherUser.name} />
            <AvatarFallback className="bg-gradient-to-r from-gradient-start to-gradient-end text-white">
              {getInitials(otherUser.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-spotify-white">{otherUser.name}</p>
            <p className="text-xs text-spotify-text capitalize">{otherUser.type}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-spotify-text">
            <Calendar className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-spotify-text">
            <Clock className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
            <span>{formattedTime}</span>
          </div>
          {userType === "singer" && (
            <div className="flex items-center text-sm text-spotify-text">
              <DollarSign className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
              <span>R$ {live.price.toFixed(2)}</span>
            </div>
          )}
          {userType === "composer" && !isPast && live.paymentStatus === "completed" && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                Pagamento confirmado
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isPast ? (
          <Button variant="outline" className="w-full border-spotify text-spotify hover:bg-spotify/10" asChild>
            <Link href={`/history/${live.id}`} className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Ver Detalhes
            </Link>
          </Button>
        ) : (
          <Button className="w-full bg-spotify hover:bg-spotify-dark text-black" asChild>
            <Link href={`/live/${live.id}`} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Entrar na Live
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

