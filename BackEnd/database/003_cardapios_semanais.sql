USE siaae;

ALTER TABLE cardapios
  ADD COLUMN dia_semana TINYINT UNSIGNED NULL AFTER nutricionista_id;

UPDATE cardapios
SET dia_semana = WEEKDAY(data) + 1;

ALTER TABLE cardapios
  DROP INDEX uq_cardapio_refeicao,
  DROP INDEX idx_cardapios_data,
  DROP COLUMN data,
  MODIFY COLUMN dia_semana TINYINT UNSIGNED NOT NULL COMMENT '1 = segunda-feira, 7 = domingo',
  ADD UNIQUE KEY uq_cardapio_refeicao (escola_id, dia_semana, turno, refeicao, etapa_ensino),
  ADD INDEX idx_cardapios_dia_semana (dia_semana, ativo);