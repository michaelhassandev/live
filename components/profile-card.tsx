import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, User, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileCard({ user }) {
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
    <Card className="music-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16 border-2 border-spotify">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-gradient-start to-gradient-end text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg line-clamp-1 text-spotify-white">{user.name}</CardTitle>
              <Badge
                variant={user.type === "composer" ? "default" : "secondary"}
                className="ml-auto bg-spotify text-black"
              >
                {user.type === "composer" ? "Compositor" : "Cantor"}
              </Badge>
            </div>
            {user.rating > 0 && (
              <CardDescription className="flex items-center text-spotify-text">
                <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                <span>{user.rating.toFixed(1)}</span>
                <span className="text-xs ml-1">({user.reviewCount})</span>
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-spotify-text">
            <User className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.type === "composer" && (
            <div className="flex items-center text-sm text-spotify-text">
              <Music className="mr-2 h-4 w-4 text-spotify flex-shrink-0" />
              <span>{user.compositions?.length || 0} composições</span>
            </div>
          )}
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1 text-spotify-white">Gêneros Musicais</h4>
            <div className="flex flex-wrap gap-1">
              {user.genres?.length > 0 ? (
                user.genres.map((genre, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-0 border-spotify/50 text-spotify">
                    {genre}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-spotify-text">Nenhum gênero definido</span>
              )}
            </div>
          </div>
          {user.bio && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1 text-spotify-white">Sobre</h4>
              <p className="text-sm text-spotify-text">{user.bio}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

