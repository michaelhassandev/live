import mysql from "mysql2/promise"

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "audicao",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexões para reutilização
const pool = mysql.createPool(dbConfig)

// Função para executar queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Funções de usuário
export async function getUserById(id: number) {
  const user = await query("SELECT * FROM users WHERE id = ?", [id])

  if (!user || (user as any[]).length === 0) return null

  // Buscar gêneros do usuário
  const genres = await query("SELECT genre FROM user_genres WHERE user_id = ?", [id])

  const userWithGenres = {
    ...(user as any[])[0],
    genres: (genres as any[]).map((g) => g.genre),
  }

  // Se for compositor, buscar composições
  if (userWithGenres.type === "composer") {
    const compositions = await query("SELECT * FROM compositions WHERE composer_id = ?", [id])
    userWithGenres.compositions = compositions
  }

  return userWithGenres
}

export async function getUserByEmail(email: string) {
  const users = await query("SELECT * FROM users WHERE email = ?", [email])

  if (!users || (users as any[]).length === 0) return null

  return (users as any[])[0]
}

export async function createUser(userData: any) {
  const { name, email, password, type, bio = "" } = userData

  const result = await query("INSERT INTO users (name, email, password, type, bio) VALUES (?, ?, ?, ?, ?)", [
    name,
    email,
    password,
    type,
    bio,
  ])

  const userId = (result as any).insertId

  // Se houver gêneros, inserir
  if (userData.genres && Array.isArray(userData.genres)) {
    for (const genre of userData.genres) {
      await query("INSERT INTO user_genres (user_id, genre) VALUES (?, ?)", [userId, genre])
    }
  }

  return userId
}

// Funções de composições
export async function getCompositionsByComposerId(composerId: number) {
  return query("SELECT * FROM compositions WHERE composer_id = ?", [composerId])
}

export async function createComposition(compositionData: any) {
  const { composer_id, title, genre, description, audio_url = null } = compositionData

  const result = await query(
    "INSERT INTO compositions (composer_id, title, genre, description, audio_url) VALUES (?, ?, ?, ?, ?)",
    [composer_id, title, genre, description, audio_url],
  )

  return (result as any).insertId
}

// Funções de lives
export async function getLiveSessionById(id: number) {
  const live = await query("SELECT * FROM live_sessions WHERE id = ?", [id])

  if (!live || (live as any[]).length === 0) return null

  const liveData = (live as any[])[0]

  // Buscar compositor e cantor
  const composer = await getUserById(liveData.composer_id)
  const singer = liveData.singer_id ? await getUserById(liveData.singer_id) : null

  // Buscar composições selecionadas
  const selectedCompositions = await query(
    `SELECT c.* FROM compositions c
     JOIN live_selected_compositions lsc ON c.id = lsc.composition_id
     WHERE lsc.live_id = ?`,
    [id],
  )

  return {
    ...liveData,
    composer,
    singer,
    selectedCompositions,
  }
}

export async function getLiveSessionsByUserId(userId: number) {
  const lives = await query("SELECT * FROM live_sessions WHERE composer_id = ? OR singer_id = ? ORDER BY date DESC", [
    userId,
    userId,
  ])

  const livesWithDetails = []

  for (const live of lives as any[]) {
    const composer = await getUserById(live.composer_id)
    const singer = live.singer_id ? await getUserById(live.singer_id) : null

    livesWithDetails.push({
      ...live,
      composer,
      singer,
    })
  }

  return livesWithDetails
}

export async function createLiveSession(liveData: any) {
  const { composer_id, singer_id = null, date, price } = liveData

  const result = await query("INSERT INTO live_sessions (composer_id, singer_id, date, price) VALUES (?, ?, ?, ?)", [
    composer_id,
    singer_id,
    date,
    price,
  ])

  return (result as any).insertId
}

export async function updateLiveSession(id: number, updateData: any) {
  const fields = Object.keys(updateData)
  const values = Object.values(updateData)

  const setClause = fields.map((field) => `${field} = ?`).join(", ")

  await query(`UPDATE live_sessions SET ${setClause} WHERE id = ?`, [...values, id])

  return true
}

// Funções de configurações
export async function getAppSettings() {
  const settings = await query("SELECT * FROM app_settings")

  const settingsObject = {}
  for (const setting of settings as any[]) {
    settingsObject[setting.setting_key] = setting.setting_value
  }

  return settingsObject
}

export async function updateAppSetting(key: string, value: string) {
  await query(
    "INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
    [key, value, value],
  )

  return true
}

// Funções de pagamento
export async function logPayment(paymentData: any) {
  const { live_id, transaction_id, amount, provider, status, response_data } = paymentData

  const result = await query(
    "INSERT INTO payment_logs (live_id, transaction_id, amount, provider, status, response_data) VALUES (?, ?, ?, ?, ?, ?)",
    [live_id, transaction_id, amount, provider, status, JSON.stringify(response_data)],
  )

  return (result as any).insertId
}

export async function getPaymentLogsByLiveId(liveId: number) {
  return query("SELECT * FROM payment_logs WHERE live_id = ? ORDER BY created_at DESC", [liveId])
}

