-- Esquema de banco de dados MySQL para o aplicativo Audição

-- Tabela de usuários
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- Armazenar hash da senha
  type ENUM('composer', 'singer', 'admin') NOT NULL,
  bio TEXT,
  profile_image VARCHAR(255),
  rating DECIMAL(3,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de gêneros musicais dos usuários
CREATE TABLE user_genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  genre VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_genre (user_id, genre)
);

-- Tabela de composições
CREATE TABLE compositions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  composer_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  description TEXT,
  audio_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (composer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de lives
CREATE TABLE live_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  composer_id INT NOT NULL,
  singer_id INT,
  date DATETIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  payment_transaction_id VARCHAR(100),
  notes TEXT,
  recording_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (composer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (singer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de composições selecionadas em lives
CREATE TABLE live_selected_compositions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  live_id INT NOT NULL,
  composition_id INT NOT NULL,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (live_id) REFERENCES live_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (composition_id) REFERENCES compositions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_live_composition (live_id, composition_id)
);

-- Tabela de mensagens de chat em lives
CREATE TABLE live_chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  live_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (live_id) REFERENCES live_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de avaliações
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reviewer_id INT NOT NULL,
  reviewed_id INT NOT NULL,
  live_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (live_id) REFERENCES live_sessions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review (reviewer_id, reviewed_id, live_id)
);

-- Tabela de configurações do sistema
CREATE TABLE app_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(50) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de logs de pagamento
CREATE TABLE payment_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  live_id INT NOT NULL,
  transaction_id VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  response_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (live_id) REFERENCES live_sessions(id) ON DELETE CASCADE
);

-- Inserir configurações iniciais
INSERT INTO app_settings (setting_key, setting_value) VALUES
('mercadopago_api_key', ''),
('mercadopago_client_id', ''),
('mercadopago_client_secret', ''),
('default_live_price', '50.00'),
('site_name', 'Audição'),
('contact_email', 'contato@audicao.com');

-- Inserir usuário administrador
INSERT INTO users (name, email, password, type, bio) VALUES
('Administrador', 'admin@audicao.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrador do sistema');

