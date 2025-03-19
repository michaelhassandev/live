"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Upload, Music, Volume2 } from "lucide-react"

interface AudioShareProps {
  compositionId?: string
  title?: string
}

export function AudioShare({ compositionId, title = "Compartilhar Áudio" }: AudioShareProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isSharing, setIsSharing] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const streamDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null)

  useEffect(() => {
    // Inicializar o contexto de áudio
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      // Limpar recursos ao desmontar
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [audioFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files && files.length > 0) {
      const file = files[0]

      // Verificar se é um arquivo de áudio
      if (file.type.startsWith("audio/")) {
        setAudioFile(file)

        // Criar URL para o arquivo
        const audioUrl = URL.createObjectURL(file)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.load()
        }
      } else {
        alert("Por favor, selecione um arquivo de áudio válido.")
      }
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return

    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return

    const newVolume = value[0]
    audioRef.current.volume = newVolume
    setVolume(newVolume)

    // Atualizar o ganho se estiver compartilhando
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume
    }
  }

  const toggleShare = () => {
    if (!audioRef.current || !audioContextRef.current) return

    if (isSharing) {
      // Parar de compartilhar
      setIsSharing(false)

      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
      }

      alert("Compartilhamento de áudio interrompido")
    } else {
      // Iniciar compartilhamento
      const audioContext = audioContextRef.current

      // Criar nós de áudio
      const sourceNode = audioContext.createMediaElementSource(audioRef.current)
      const gainNode = audioContext.createGain()
      const streamDestination = audioContext.createMediaStreamDestination()

      // Configurar ganho
      gainNode.gain.value = volume

      // Conectar nós
      sourceNode.connect(gainNode)
      gainNode.connect(streamDestination)
      gainNode.connect(audioContext.destination) // Para ouvir localmente também

      // Salvar referências
      sourceNodeRef.current = sourceNode
      gainNodeRef.current = gainNode
      streamDestinationRef.current = streamDestination

      // Obter stream de áudio
      const audioStream = streamDestination.stream

      // Aqui você pode enviar o stream para outros participantes
      // usando a API WebRTC ou outra solução de streaming

      setIsSharing(true)
      alert("Áudio sendo compartilhado! (Simulação)")
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Music className="h-5 w-5" />
        {title}
      </h3>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="w-full">
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Arquivo
              <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
            </label>
          </Button>

          {audioFile && (
            <Button variant={isSharing ? "destructive" : "default"} size="sm" onClick={toggleShare}>
              {isSharing ? "Parar Compartilhamento" : "Compartilhar Áudio"}
            </Button>
          )}
        </div>

        {audioFile && <p className="text-sm text-gray-500 mt-2 truncate">{audioFile.name}</p>}
      </div>

      {audioFile && (
        <>
          <audio ref={audioRef} className="hidden" />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div className="flex-1">
                <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

