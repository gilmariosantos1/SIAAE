USE siaae;

ALTER TABLE avaliacoes
  DROP FOREIGN KEY avaliacoes_ibfk_2,
  DROP INDEX uq_escola_cardapio,
  ADD COLUMN turma_id INT UNSIGNED NOT NULL AFTER escola_id,
  ADD COLUMN etapa_ensino VARCHAR(80) NOT NULL AFTER turma_id,
  ADD COLUMN refeicao_servida_id BIGINT UNSIGNED NOT NULL AFTER etapa_ensino,
  ADD CONSTRAINT fk_avaliacoes_turma
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
  ADD CONSTRAINT fk_avaliacoes_escola
    FOREIGN KEY (escola_id) REFERENCES escolas(id),
  ADD CONSTRAINT fk_avaliacoes_refeicao_servida
    FOREIGN KEY (refeicao_servida_id) REFERENCES refeicoes_servidas(id),
  ADD UNIQUE KEY uq_turma_refeicao_servida (turma_id, refeicao_servida_id);
