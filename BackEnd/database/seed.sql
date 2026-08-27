USE siaae;
INSERT INTO escolas (nome, codigo_inep, endereco, diretor) VALUES
('EMEF Caminhos do Saber', '00000001', 'Rua da Educação, 100', 'Direção escolar');
INSERT INTO turmas (escola_id, nome, faixa_etaria, turno) VALUES
(1, '5º ano A', '10 a 11 anos', 'manha');
INSERT INTO alunos (turma_id, identificador_anonimo) VALUES
(1, SHA2('siaae-demo-aluno', 256));
INSERT INTO cardapios (escola_id, data, turno, refeicao, nome_prato, ingredientes) VALUES
(1, CURRENT_DATE, 'manha', 'Almoço', 'Arroz, feijão e frango assado', 'Arroz, feijão, frango, salada e banana');
