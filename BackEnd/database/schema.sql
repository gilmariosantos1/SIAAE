CREATE DATABASE IF NOT EXISTS siaae CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE siaae;

CREATE TABLE escolas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  codigo_inep VARCHAR(20) NOT NULL UNIQUE,
  endereco VARCHAR(255) NOT NULL,
  diretor VARCHAR(160) NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_escolas_ativo (ativo)
);

CREATE TABLE turmas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  escola_id INT UNSIGNED NOT NULL,
  nome VARCHAR(80) NOT NULL,
  etapa_ensino ENUM('Educação Infantil - Creche','Educação Infantil - Pré-Escolar', '1º Ano', '2º Ano','3º Ano','4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano', 'EJAEF - Anos Iniciais', 'EJAEF - Anos Finais') NOT NULL,
  faixa_etaria VARCHAR(40) NOT NULL,
  turno ENUM('manha', 'tarde', 'noite', 'integral') NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (escola_id) REFERENCES escolas(id),
  INDEX idx_turmas_escola (escola_id)
);

CREATE TABLE usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil ENUM('administrador', 'nutricionista', 'diretor') NOT NULL,
  escola_id INT UNSIGNED NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (escola_id) REFERENCES escolas(id),
  INDEX idx_usuarios_perfil (perfil)
);

CREATE TABLE alunos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  turma_id INT UNSIGNED NOT NULL,
  identificador_anonimo CHAR(64) NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

CREATE TABLE cardapios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  escola_id INT UNSIGNED NOT NULL,
  nutricionista_id INT UNSIGNED NULL,
  dia_semana TINYINT UNSIGNED NOT NULL COMMENT '1 = segunda-feira, 7 = domingo',
  turno ENUM('manha', 'tarde', 'noite', 'integral') NOT NULL,
  etapa_ensino ENUM('Educação Infantil - Creche','Educação Infantil - Pré-Escolar', 'Ensino Fundamental - Anos Iniciais', 'Ensino Fundamental - Anos Finais', 'EJA - Anos Iniciais', 'EJA - Anos Finais') NOT NULL,
  refeicao VARCHAR(80) NOT NULL,
  nome_prato VARCHAR(160) NOT NULL,
  ingredientes TEXT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (escola_id) REFERENCES escolas(id),
  FOREIGN KEY (nutricionista_id) REFERENCES usuarios(id),
  UNIQUE KEY uq_cardapio_refeicao (escola_id, dia_semana, turno, refeicao, etapa_ensino),
  INDEX idx_cardapios_dia_semana (dia_semana, ativo)
);

CREATE TABLE cardapio_ingredientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cardapio_id INT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  FOREIGN KEY (cardapio_id) REFERENCES cardapios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cardapio_ingrediente (cardapio_id, nome)
);

CREATE TABLE refeicoes_servidas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cardapio_id INT UNSIGNED NOT NULL,
  escola_id INT UNSIGNED NOT NULL,
  turma_id INT UNSIGNED NOT NULL,
  etapa_ensino VARCHAR(80) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cardapio_id) REFERENCES cardapios(id),
  FOREIGN KEY (escola_id) REFERENCES escolas(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id),
  INDEX idx_refeicoes_servidas_cardapio (cardapio_id, criado_em)
);

CREATE TABLE refeicoes_servidas_ingredientes (
  refeicao_servida_id BIGINT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  PRIMARY KEY (refeicao_servida_id, nome),
  FOREIGN KEY (refeicao_servida_id) REFERENCES refeicoes_servidas(id) ON DELETE CASCADE
);

CREATE TABLE avaliacoes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cardapio_id INT UNSIGNED NOT NULL,
  escola_id INT UNSIGNED NOT NULL,
  turma_id INT UNSIGNED NOT NULL,
  etapa_ensino VARCHAR(80) NOT NULL,
  refeicao_servida_id BIGINT UNSIGNED NOT NULL,
  sabor TINYINT UNSIGNED NOT NULL CHECK (sabor BETWEEN 1 AND 5),
  aparencia TINYINT UNSIGNED NOT NULL CHECK (aparencia BETWEEN 1 AND 5),
  temperatura TINYINT UNSIGNED NOT NULL CHECK (temperatura BETWEEN 1 AND 5),
  quantidade TINYINT UNSIGNED NOT NULL CHECK (quantidade BETWEEN 1 AND 5),
  sugestao VARCHAR(500) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cardapio_id) REFERENCES cardapios(id),
  FOREIGN KEY (escola_id) REFERENCES escolas(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id),
  FOREIGN KEY (refeicao_servida_id) REFERENCES refeicoes_servidas(id),
  UNIQUE KEY uq_turma_refeicao_servida (turma_id, refeicao_servida_id),
  INDEX idx_avaliacoes_cardapio (cardapio_id, criado_em)
);

CREATE TABLE feedbacks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  escola_id INT UNSIGNED NULL,
  aluno_id INT UNSIGNED NULL,
  tipo ENUM('sugestao', 'reclamacao', 'elogio') NOT NULL,
  mensagem VARCHAR(1000) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (escola_id) REFERENCES escolas(id),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

CREATE TABLE alertas_nutricionais (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cardapio_id INT UNSIGNED NOT NULL,
  media DECIMAL(4,2) NOT NULL,
  resolvido BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cardapio_id) REFERENCES cardapios(id),
  INDEX idx_alertas_status (resolvido, criado_em)
);

CREATE TABLE logs_acesso (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NULL,
  acao VARCHAR(120) NOT NULL,
  ip_hash CHAR(64) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
-- avaliar inserir etapa de ensino junto ao cardápio, para que seja possível filtrar cardápios por etapa de ensino. 20260030727436
--O protocolo deste atendimento é: 2026-0030727496