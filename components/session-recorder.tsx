"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RepeatIcon as Record, StopCircle, Download } from "lucide-react"

interface SessionRecorderProps {
  stream?: MediaStream
}

export function SessionRecorder({ stream }: SessionRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = () => {
    if (!stream) {
      alert("Nenhum stream disponível para gravar")
      return
    }

    // Limpar gravação anterior
    chunksRef.current = []
    setRecordedBlob(null)
    setRecordingTime(0)

    // Criar gravador de mídia
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    // Configurar manipuladores de eventos
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      setRecordedBlob(blob)
    }

    // Iniciar gravação
    mediaRecorder.start(1000) // Coletar dados a cada segundo
    setIsRecording(true)

    // Iniciar temporizador
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Parar temporizador
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const downloadRecording = () => {
    if (!recordedBlob) return

    const url = URL.createObjectURL(recordedBlob)
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = `audicao-live-recording-${new Date().toISOString()}.webm`
    document.body.appendChild(a)
    a.click()

    // Limpar
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Record className="h-5 w-5 text-red-500" />
        Gravar Sessão
      </h3>

      <div className="flex items-center gap-2">
        {isRecording ? (
          <Button variant="destructive" onClick={stopRecording} className="flex-1">
            <StopCircle className="h-4 w-4 mr-2" />
            Parar Gravação ({formatTime(recordingTime)})
          </Button>
        ) : (
          <Button variant="default" onClick={startRecording} className="flex-1" disabled={!stream}>
            <Record className="h-4 w-4 mr-2" />
            Iniciar Gravação
          </Button>
        )}

        {recordedBlob && !isRecording && (
          <Button variant="outline" onClick={downloadRecording}>
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
        )}
      </div>

      {!stream && (
        <p className="text-sm text-yellow-500 mt-2">Conecte-se à videoconferência para habilitar a gravação</p>
      )}

      {recordedBlob && !isRecording && (
        <p className="text-sm text-green-500 mt-2">
          Gravação concluída! ({(recordedBlob.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
      )}
    </div>
  )
}

