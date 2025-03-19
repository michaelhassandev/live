"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simulação de sessão com cookies
export async function getUserData() {
  // Verificar se há um usuário logado através do cookie
  const userId = cookies().get("userId")?.value

  if (!userId) {
    // Não retornar usuário de demonstração, apenas null
    return null
  }

  try {
    // Em um ambiente real, você buscaria o usuário do banco de dados
    const user = {
      id: Number.parseInt(userId),
      name: "Usuário Logado",
      email: "usuario@audicao.com",
      type: userId === "1" ? "composer" : userId === "2" ? "singer" : "admin",
      bio: "Este é um usuário logado",
      profileImage: null,
      rating: 4.8,
      reviewCount: 15,
      genres: ["Pop", "Rock", "MPB"],
      compositions: [],
    }

    return user
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Autenticação
export async function registerUser(userData) {
  try {
    // Simulação de registro bem-sucedido
    const userId = Math.floor(Math.random() * 1000) + 1

    // Definir cookie de sessão
    cookies().set("userId", userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    return { success: true, userId }
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

export async function loginUser({ email, password }) {
  try {
    // Simulação de login bem-sucedido
    // Em um ambiente real, você verificaria as credenciais no banco de dados

    // Determinar o tipo de usuário com base no email para demonstração
    let userId = "1" // compositor por padrão
    if (email.includes("singer")) {
      userId = "2" // cantor
    } else if (email.includes("admin")) {
      userId = "3" // administrador
    }

    // Definir cookie de sessão
    cookies().set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    return { success: true, userId }
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export async function logoutUser() {
  cookies().delete("userId")
  redirect("/")
}

// Compositores
export async function getComposers() {
  // Verificar se o usuário está autenticado
  const user = await getUserData()
  if (!user) {
    return []
  }

  // Retornar lista de compositores do banco de dados
  // Aqui estamos simulando, mas em um ambiente real, você buscaria do banco
  return [
    {
      id: 101,
      name: "João Compositor",
      email: "joao@audicao.com",
      type: "composer",
      bio: "Compositor de MPB e Pop",
      profileImage: null,
      rating: 4.7,
      reviewCount: 23,
      genres: ["MPB", "Pop"],
      price: 100.0,
      compositions: [
        { id: 1, title: "Canção do Mar", genre: "MPB", description: "Uma canção sobre o mar" },
        { id: 2, title: "Amor Eterno", genre: "Pop", description: "Uma canção romântica" },
      ],
    },
    {
      id: 102,
      name: "Maria Compositora",
      email: "maria@audicao.com",
      type: "composer",
      bio: "Compositora de Rock e Blues",
      profileImage: null,
      rating: 4.9,
      reviewCount: 31,
      genres: ["Rock", "Blues"],
      price: 120.0,
      compositions: [
        { id: 3, title: "Noite Escura", genre: "Rock", description: "Uma canção de rock" },
        { id: 4, title: "Tristeza Azul", genre: "Blues", description: "Um blues melancólico" },
      ],
    },
  ]
}

export async function getCompositions(composerId) {
  // Simulação de composições para o compositor especificado
  const compositions = [
    { id: 1, title: "Canção do Mar", genre: "MPB", description: "Uma canção sobre o mar" },
    { id: 2, title: "Amor Eterno", genre: "Pop", description: "Uma canção romântica" },
    { id: 3, title: "Noite Escura", genre: "Rock", description: "Uma canção de rock" },
    { id: 4, title: "Tristeza Azul", genre: "Blues", description: "Um blues melancólico" },
  ]

  // Filtrar composições para o compositor específico (simulação)
  return compositions.filter((comp) => comp.id % 2 === composerId % 2)
}

export async function createComposition(compositionData) {
  try {
    const user = await getUserData()

    if (!user || user.type !== "composer") {
      throw new Error("Não autorizado")
    }

    // Simulação de criação de composição
    const compositionId = Math.floor(Math.random() * 1000) + 1

    return { success: true, compositionId }
  } catch (error) {
    console.error("Error creating composition:", error)
    throw error
  }
}

// Lives
// Modificar a função getScheduledLives para verificar autenticação
export async function getScheduledLives() {
  try {
    const user = await getUserData()

    if (!user) {
      // Retornar array vazio se não houver usuário autenticado
      return []
    }

    // Simulação de lives agendadas
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    const lives = [
      {
        id: 201,
        composer_id: 101,
        singer_id: 201,
        date: tomorrow.toISOString(),
        price: 100.0,
        payment_status: "pending",
        payment_transaction_id: null,
        notes: "",
        recording_url: null,
        composer: {
          id: 101,
          name: "João Compositor",
          type: "composer",
          profileImage: null,
        },
        singer: {
          id: 201,
          name: "Ana Cantora",
          type: "singer",
          profileImage: null,
        },
      },
      {
        id: 202,
        composer_id: 102,
        singer_id: 201,
        date: yesterday.toISOString(),
        price: 120.0,
        payment_status: "completed",
        payment_transaction_id: "MP_123456",
        notes: "Live muito produtiva",
        recording_url: null,
        composer: {
          id: 102,
          name: "Maria Compositora",
          type: "composer",
          profileImage: null,
        },
        singer: {
          id: 201,
          name: "Ana Cantora",
          type: "singer",
          profileImage: null,
        },
      },
    ]

    // Filtrar lives com base no tipo de usuário
    if (user.type === "composer") {
      return lives.filter((live) => live.composer_id === user.id)
    } else if (user.type === "singer") {
      return lives.filter((live) => live.singer_id === user.id)
    } else {
      return lives // Admin vê todas as lives
    }
  } catch (error) {
    console.error("Error fetching scheduled lives:", error)
    return []
  }
}

// Modificar a função getLiveSession para verificar autenticação
export async function getLiveSession(liveId) {
  try {
    const user = await getUserData()

    if (!user) {
      return null
    }

    // Obter o preço padrão definido pelo administrador
    const settings = await getAppSettings()
    const defaultPrice = Number.parseFloat(settings.default_live_price || "100.00")

    // Simulação de detalhes da live
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const live = {
      id: Number.parseInt(liveId),
      composer_id: 101,
      singer_id: 201,
      date: tomorrow.toISOString(),
      price: defaultPrice,
      payment_status: "pending",
      payment_transaction_id: null,
      notes: "",
      recording_url: null,
      composer: {
        id: 101,
        name: "João Compositor",
        type: "composer",
        profileImage: null,
      },
      singer: {
        id: 201,
        name: "Ana Cantora",
        type: "singer",
        profileImage: null,
      },
      selectedCompositions: [],
    }

    return live
  } catch (error) {
    console.error("Error fetching live session:", error)
    return null
  }
}

export async function createLiveSession(liveData) {
  try {
    const user = await getUserData()

    if (!user) {
      throw new Error("Não autorizado")
    }

    // Obter o preço padrão definido pelo administrador
    const settings = await getAppSettings()
    const defaultPrice = Number.parseFloat(settings.default_live_price || "100.00")

    // Preparar dados da live com base no tipo de usuário
    const liveSessionData = {
      composer_id: user.type === "composer" ? user.id : liveData.composerId,
      singer_id: user.type === "singer" ? user.id : liveData.singerId,
      date: liveData.date,
      price: defaultPrice,
      payment_status: "pending",
    }

    // Criar live com o preço definido pelo administrador
    const liveId = Math.floor(Math.random() * 1000) + 1

    return { success: true, liveId }
  } catch (error) {
    console.error("Error creating live session:", error)
    throw error
  }
}

export async function selectComposition(liveId, compositionId) {
  try {
    const user = await getUserData()

    if (!user) {
      throw new Error("Não autorizado")
    }

    // Simulação de seleção de composição
    return { success: true }
  } catch (error) {
    console.error("Error selecting composition:", error)
    throw error
  }
}

export async function updateLiveNotes(liveId, notes) {
  try {
    const user = await getUserData()

    if (!user) {
      throw new Error("Não autorizado")
    }

    // Simulação de atualização de notas
    return { success: true }
  } catch (error) {
    console.error("Error updating live notes:", error)
    throw error
  }
}

export async function saveRecordingUrl(liveId, recordingUrl) {
  try {
    const user = await getUserData()

    if (!user) {
      throw new Error("Não autorizado")
    }

    // Simulação de salvamento de URL de gravação
    return { success: true }
  } catch (error) {
    console.error("Error saving recording URL:", error)
    throw error
  }
}

// Mercado Pago integration
export async function generatePixPayment(liveId) {
  try {
    const user = await getUserData()

    if (!user) {
      throw new Error("Não autorizado")
    }

    // Obter a live para saber o preço
    const live = await getLiveSession(liveId)

    if (!live) {
      throw new Error("Live não encontrada")
    }

    // Simulação de geração de pagamento PIX
    const result = {
      id: `MP_${Math.random().toString(36).substring(2, 15)}`,
      status: "pending",
      point_of_interaction: {
        transaction_data: {
          qr_code: `00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426655440000520400005303986540${live.price.toFixed(2).replace(".", "")}5802BR5913AUDICAO APP6008SAOPAULO62070503***6304E2CA`,
          qr_code_base64:
            "iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQAQMAAAC6caSPAAAABlBMVEX///8AAABVwtN+AAACJ0lEQVR4nO3aS3LDIBCFYbFgmSNwFI7G0TgKR2CZBdWoB4/Gru0qV5K/Mst6fNBAI7Dj8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PBu7/dL/4udjv7l9rT3Yfk8aV8/2mZfbDpJX1/aL7a+fPwrm/8+tLftYrPdwfaLzZOGh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4d3e6/9Yt/9YtPQv9wut/6X9vWjbfbFppP09aX9YuvLx7+y+e9De9suttkdbL/YPGl4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wDsN/WLLvX+5vfWLTZP29aNt9sWmSfv60n6x9eXjX9n896G9bRfb7A62X2yeNDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8vNt7u/eLTUP/crvs+l/a14+22RebJu3rS/vF1pePf2Xz34f2tl1sszv4B7F50vDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8G7vB9s4dIiQKUU0AAAAAElFTkSuQmCC",
        },
      },
    }

    return {
      success: true,
      qrCode: result.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64,
      transactionId: result.id,
    }
  } catch (error) {
    console.error("Error generating PIX payment:", error)
    throw error
  }
}

export async function checkPaymentStatus(liveId) {
  try {
    const user = await getUserData()

    if (!user) {
      throw new Error("Não autorizado")
    }

    // Simulação de verificação de status de pagamento
    const result = {
      id: `MP_${liveId}`,
      status: Math.random() > 0.3 ? "approved" : "pending",
    }

    return {
      success: true,
      status: result.status,
      liveStatus: result.status === "approved" ? "completed" : "pending",
    }
  } catch (error) {
    console.error("Error checking payment status:", error)
    throw error
  }
}

// Admin functions
export async function getAdminStats() {
  try {
    const user = await getUserData()

    if (!user || user.type !== "admin") {
      throw new Error("Não autorizado")
    }

    // Simulação de estatísticas de administrador
    return {
      totalUsers: 150,
      totalComposers: 80,
      totalSingers: 70,
      totalLives: 45,
      pendingLives: 15,
      completedLives: 30,
      totalRevenue: 4500.0,
      recentLives: [],
      recentPayments: [],
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    throw error
  }
}

export async function getAppSettings() {
  try {
    // Tentar ler do cookie primeiro
    const settingsCookie = cookies().get("app_settings")?.value

    if (settingsCookie) {
      try {
        return JSON.parse(settingsCookie)
      } catch (e) {
        console.error("Error parsing settings cookie:", e)
      }
    }

    // Configurações padrão caso não exista cookie
    return {
      mercadopago_api_key: "TEST_API_KEY",
      mercadopago_client_id: "TEST_CLIENT_ID",
      mercadopago_client_secret: "TEST_CLIENT_SECRET",
      default_live_price: "100.00", // Preço padrão para lives
      site_name: "Audição",
      contact_email: "contato@audicao.com",
    }
  } catch (error) {
    console.error("Error fetching app settings:", error)
    throw error
  }
}

export async function updateAppSettings(settings) {
  try {
    const user = await getUserData()

    if (!user || user.type !== "admin") {
      throw new Error("Não autorizado")
    }

    // Simulação de atualização de configurações
    // Em um ambiente real, você salvaria no banco de dados

    // Armazenar as configurações em um cookie para persistência na simulação
    const settingsStr = JSON.stringify(settings)
    cookies().set("app_settings", settingsStr, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating app settings:", error)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const user = await getUserData()

    if (!user || user.type !== "admin") {
      throw new Error("Não autorizado")
    }

    // Simulação de lista de usuários
    return [
      {
        id: 1,
        name: "João Compositor",
        email: "joao@audicao.com",
        type: "composer",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Ana Cantora",
        email: "ana@audicao.com",
        type: "singer",
        created_at: new Date().toISOString(),
      },
    ]
  } catch (error) {
    console.error("Error fetching all users:", error)
    throw error
  }
}

export async function getAllLives() {
  try {
    const user = await getUserData()

    if (!user || user.type !== "admin") {
      throw new Error("Não autorizado")
    }

    // Simulação de lista de lives
    return [
      {
        id: 1,
        composer_id: 1,
        singer_id: 2,
        date: new Date().toISOString(),
        price: 100.0,
        payment_status: "completed",
        composer_name: "João Compositor",
        singer_name: "Ana Cantora",
      },
    ]
  } catch (error) {
    console.error("Error fetching all lives:", error)
    throw error
  }
}

export async function getAllPayments() {
  try {
    const user = await getUserData()

    if (!user || user.type !== "admin") {
      throw new Error("Não autorizado")
    }

    // Simulação de lista de pagamentos
    return [
      {
        id: 1,
        live_id: 1,
        transaction_id: "MP_123456",
        amount: 100.0,
        provider: "mercadopago",
        status: "approved",
        created_at: new Date().toISOString(),
        composer_id: 1,
        composer_name: "João Compositor",
        singer_id: 2,
        singer_name: "Ana Cantora",
      },
    ]
  } catch (error) {
    console.error("Error fetching all payments:", error)
    throw error
  }
}

// Adicione esta função ao arquivo lib/actions.ts

export async function getUserById(userId) {
  try {
    // Simulação de busca de usuário por ID
    // Em um ambiente real, você buscaria o usuário do banco de dados

    // Determinar o tipo de usuário com base no ID para demonstração
    const userType = userId % 3 === 0 ? "admin" : userId % 2 === 0 ? "singer" : "composer"

    const user = {
      id: Number.parseInt(userId),
      name: userType === "composer" ? "João Compositor" : userType === "singer" ? "Ana Cantora" : "Admin Sistema",
      email: `${userType}@audicao.com`,
      type: userType,
      bio: `Este é um usuário ${userType} de demonstração`,
      profileImage: null,
      rating: 4.8,
      reviewCount: 15,
      genres: ["Pop", "Rock", "MPB"],
      compositions:
        userType === "composer"
          ? [
              { id: 1, title: "Canção do Mar", genre: "MPB", description: "Uma canção sobre o mar" },
              { id: 2, title: "Amor Eterno", genre: "Pop", description: "Uma canção romântica" },
            ]
          : [],
      created_at: new Date().toISOString(),
    }

    return user
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

export async function getPaymentLogsByLiveId(liveId) {
  try {
    // Simulação de busca de logs de pagamento por ID da live
    // Em um ambiente real, você buscaria os logs do banco de dados

    const logs = [
      {
        id: 1,
        live_id: Number.parseInt(liveId),
        transaction_id: `MP_${liveId}_1`,
        amount: 100.0,
        provider: "mercadopago",
        status: "approved",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        live_id: Number.parseInt(liveId),
        transaction_id: `MP_${liveId}_2`,
        amount: 100.0,
        provider: "mercadopago",
        status: "pending",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      },
    ]

    return logs
  } catch (error) {
    console.error("Error fetching payment logs by live ID:", error)
    return []
  }
}

// Adicionar função para aceitar convite de live
export async function acceptLiveInvite(liveId, singerId) {
  try {
    const user = await getUserData()

    if (!user || user.type !== "singer") {
      throw new Error("Não autorizado")
    }

    // Em um ambiente real, você atualizaria a live no banco de dados
    // para adicionar o ID do cantor e atualizar o status

    // Simulação de aceitação de convite
    console.log(`Live ${liveId} aceita pelo cantor ${singerId}`)

    return { success: true }
  } catch (error) {
    console.error("Error accepting live invite:", error)
    throw error
  }
}

