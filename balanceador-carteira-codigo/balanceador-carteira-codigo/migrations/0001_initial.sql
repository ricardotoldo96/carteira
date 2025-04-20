-- Inicialização do banco de dados para o Balanceador de Carteira

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário padrão
INSERT INTO users (username, password) 
VALUES ('RicardoToldo', 'ricardo1008');

-- Tabela de categorias de ativos
CREATE TABLE IF NOT EXISTS asset_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  target_percentage REAL DEFAULT 20.0,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Inserir categorias padrão
INSERT INTO asset_categories (name, user_id) VALUES 
('Ações brasileiras', 1),
('Fundos imobiliários', 1),
('Renda fixa', 1),
('Ações internacionais', 1),
('Criptomoedas', 1);

-- Tabela de ativos
CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ticker TEXT,
  current_value REAL DEFAULT 0,
  category_id INTEGER,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES asset_categories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de histórico de balanceamento
CREATE TABLE IF NOT EXISTS balance_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total_value REAL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
