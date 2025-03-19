"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { Card } from "@/components/ui/card"

export function QRCodeDisplay({ value }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: 240,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error(error)
        },
      )
    }
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <Card className="p-4 bg-white">
        <canvas ref={canvasRef} className="rounded-lg" />
      </Card>
      <p className="text-sm text-gray-500 mt-2">Escaneie o QR Code para pagar</p>
      <div className="flex items-center justify-center mt-4">
        <img src="/placeholder.svg?height=24&width=120" alt="Mercado Pago" className="h-6 mr-2" />
        <span className="text-sm text-gray-500">Pagamento processado por Mercado Pago</span>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        O pagamento é feito para a plataforma Audição, que repassa 85% do valor ao compositor
      </p>
    </div>
  )
}

