"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, Star, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ComposerCard({ composer, onSelect }) {
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={composer.profileImage} alt={composer.name} />
            <AvatarFallback>{getInitials(composer.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg line-clamp-1">{composer.name}</CardTitle>
            <CardDescription className="flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
              <span>{composer.rating.toFixed(1)}</span>
              <span className="text-xs ml-1">({composer.reviewCount})</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Music className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>{composer.compositions?.length || 0} composições</span>
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>R$ {composer.price.toFixed(2)} por live</span>
          </div>
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Gêneros Musicais</h4>
            <div className="flex flex-wrap gap-1">
              {composer.genres?.map((genre, index) => (
                <Badge key={index} variant="outline" className="text-xs py-0">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          {composer.bio && <p className="text-sm text-gray-600 line-clamp-2 mt-2">{composer.bio}</p>}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full h-10 text-base" onClick={onSelect}>
          Agendar Live
        </Button>
      </CardFooter>
    </Card>
  )
}

