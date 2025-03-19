"use client"

import { useState, useEffect, useRef } from "react"

interface VideoConferenceProps {
  liveId: string
  userId: string
  userType: "composer" | "singer" | "admin"
  isHost?: boolean
  onCallEnd?: () => void
  onStreamAvailable?: (stream: MediaStream) => void
}

export function VideoConference({
  liveId,
  userId,
  userType,
  isHost = false,
  onCallEnd,
  onStreamAvailable,
}: VideoConferenceProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const myMeeting = async (element: HTMLDivElement) => {
      try {
        // Mock implementation for demo purposes
        // In a real implementation, you would use actual ZegoCloud credentials
        const kitToken = "mock_token_for_demo"

        // Create a mock ZegoUIKitPrebuilt instance
        const mockZp = {
          joinRoom: (config: any) => {
            console.log("Joining room with config:", config)
            // Simulate room join success
            setTimeout(() => {
              console.log("Successfully joined room")
            }, 1000)
          },
        }

        // Simulate joining the room
        mockZp.joinRoom({
          container: element,
          scenario: {
            mode: "LiveStreaming",
            config: {
              onLeaveRoom: () => {
                if (onCallEnd) {
                  onCallEnd()
                }
              },
            },
          },
        })
      } catch (error) {
        console.error("Error setting up video conference:", error)
      }
    }

    const getUserMediaStream = async () => {
      try {
        // Check if we're in a browser environment with navigator
        if (typeof navigator !== "undefined" && navigator.mediaDevices) {
          // Request user permission first through a user interaction
          console.log("Waiting for user interaction to request media permissions")

          // Create a mock stream for demo purposes
          const mockStream = new MediaStream()
          setLocalStream(mockStream)

          // Notify the component parent about the stream available
          if (onStreamAvailable) {
            onStreamAvailable(mockStream)
          }

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mockStream
          }
        } else {
          console.log("Media devices not available in this environment")
        }
      } catch (error) {
        console.error("Error getting user media stream:", error)
      }
    }

    // Only attempt to get media when the component is mounted in the browser
    if (typeof window !== "undefined") {
      getUserMediaStream()
    }

    const element = document.getElementById("video-conference-container")
    if (element) {
      myMeeting(element as HTMLDivElement)
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [liveId, userId, userType, isHost, onCallEnd, onStreamAvailable])

  // Function to request permissions through user interaction
  const requestMediaPermissions = () => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream)
          if (onStreamAvailable) {
            onStreamAvailable(stream)
          }
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
        .catch((error) => {
          console.error("Error requesting media permissions:", error)
        })
    }
  }

  return (
    <>
      <video ref={localVideoRef} style={{ width: "0px", height: "0px" }} muted autoPlay playsInline />
      <div
        id="video-conference-container"
        style={{ width: "100%", height: "400px" }}
        className="bg-spotify-gray rounded-lg flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-spotify-white mb-4">Clique no botão abaixo para iniciar a videoconferência</p>
          <button
            onClick={requestMediaPermissions}
            className="bg-spotify hover:bg-spotify-dark text-black px-4 py-2 rounded-md"
          >
            Iniciar Videoconferência
          </button>
        </div>
      </div>
    </>
  )
}

// This function is a mock for demo purposes
// In a real implementation, you would use the actual ZegoCloud SDK
function generateKitTokenForProduction(appID: number, serverSecret: string, userID: string, userName: string) {
  return "mock_token_for_demo"
}

