USE siaae;

INSERT INTO escolas (nome, codigo_inep, endereco, diretor) VALUES
('CRECHE MUNICIPAL MARCELO DEDA CHAGAS', '28035453', 'AVENIDA EROTILDES NOER DE ARAGAO, 2564', 'MARLI DE OLIVEIRA'),
('CRECHE SORRISO DE CRIANÇA', '28033248', 'RUA AIRTON SENNA, 205', 'NADJA MARIA ALMEIDA COUTO FREITAS'),
('EDUCANDÁRIO SÃO FRANCISCO DE ASSIS', '28001672', 'RUA  PRINCESA IZABEL , 216', 'JUCILENE VIEIRA DE ANDRADE'),
('ESCOLA MUNICIPAL JARDIM DE INFÂNCIA PEQUENO PRÍNCIPE', '28034139', 'RUA DOM JOSE VICENTE TAVORA , 10', 'UELICA OLIVEIRA SANTOS PROCOPIO'),
('CENTRO EDUCACIONAL PEDRO RIAN DE JESUS ARAGÃO', '28036972', 'RUA  ANTONIO JOAQUIM DE FARIAS  , 233', 'MARÍLIA MOTA OLIVEIRA'),
('CRECHE MARIA DE FÁTIMA DATAS MELO', '28037740', 'RUA H - BAIRRO JOVIANO BARBOSA , S/N', 'MARCIA ANGELICA DE MELO SANTOS'),
('CENTRO EDUCACIONAL PROFESSORA MARIA DAGMAR DE MENEZES', '28036964', 'RUA MOACIR ALVES OLIVEIRA - JARDIM DO SERTÃO, S/N', 'MARIA JOSE DOS SANTOS'),
('ESCOLA MUNICIPAL PROFESSOR JOSÉ VALMIR DE SOUSA', '28036395', 'RUA ANTONIO FEITOSA DE SOUZA - RES. LEON GREGORIO, S/N', 'JOELZA OLIVEIRA SANTOS ARAUJO'),
('CENTRO DE EXCELÊNCIA EDUCACIONAL PADRE JOÃO SZUREK', '28038231', 'RUA PRINCESA ISABEL - CENTRO, 34', 'HELMA DE MELO COSTA SANTANA'),
('ESCOLA MUNICIPAL EDITON OLIVEIRA DA SILVA', '28001761', 'RUA MOACIR ALVES OLIVEIRA - JARDIM DO SERTAO , S/N', 'LAIANE ARAGÃO SANTOS'),
('ESCOLA MUNICIPAL PROFESSOR JOSÉ AUGUSTO BARRETO', '28002156', 'RUA BOCA DA MATA - BAIRRO BRASÍLIA, 444', 'LILIANE FEITOSA DOS SANTOS'),
('ESCOLA MUNICIPAL PRESIDENTE TANCREDO NEVES', '28001702', 'AVENIDA MANOEL VENANCIO CUNHA, 440', 'LEILA INAJARA SANTOS MOURA'),
('ESCOLA MUNICIPAL TIRADENTES', '28001826', 'AVENIDA LOURIVAL BATISTA, 530', 'MARIA MÁRCIA ARAGÃO DOS ANJOS'),
('ESCOLA MUNICIPAL 13 DE MAIO', '28001737', 'POVOADO ANGICO, 47', 'ERISVALDA DE SANTANA'),
('ESCOLA MUNICIPAL NAIR PEREIRA DA COSTA', '20001842', 'POVOADO ANINGAS, S/N', 'TATIANE NUNES'),
('ESCOLA MUNICIPAL LEÔNCIO RIBEIRO ARAGÃO', '28001982', 'POVOADO TANQUE DE PEDRA, S/N', 'LUCILEIDE DOS SANTOS GONÇALVES'),
('ESCOLA MUNICIPAL HERMES FONTES', '28002172', 'POVOADO SAO CLEMENTE, S/N', 'MARTINHA DO NASCIMENTO ROCHA'),
('ESCOLA MUNICIPAL PRESIDENTE DUTRA', '28002024', 'POVOADO LAGOA BONITA, S/N', 'JOSE RONALDO DE JESUS NASCIMENTO');

INSERT INTO turmas (escola_id, nome, etapa_ensino, faixa_etaria, turno) VALUES
(1, 'Berçário I', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(1, 'Berçário II', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(1, 'Maternal I', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(1, 'Maternal II', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(2, 'Berçário I', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(2, 'Berçário II', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(2, 'Maternal I', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(2, 'Maternal II', 'Educação Infantil - Creche', '0 a 3 anos', 'integral'),
(3, 'Pré-Escolar I', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'manhã'),
(3, 'Pré-Escolar I', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'tarde'),
(3, 'Pré-Escolar II', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'manhã'),
(3, 'Pré-Escolar II', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'tarde'),
(4, 'Maternal I', 'Educação Infantil - Creche', '0 a 3 anos', 'manhã'),
(4, 'Maternal II', 'Educação Infantil - Creche', '0 a 3 anos', 'tarde'),
(5, 'Maternal I', 'Educação Infantil - Creche', '0 a 3 anos', 'manhã'),
(5, 'Maternal II', 'Educação Infantil - Creche', '0 a 3 anos', 'tarde'),
(6, 'Maternal I', 'Educação Infantil - Creche', '0 a 3 anos', 'manhã'),
(6, 'Maternal I', 'Educação Infantil - Creche', '0 a 3 anos', 'tarde'),
(6, 'Maternal II', 'Educação Infantil - Creche', '0 a 3 anos', 'manhã'),
(6, 'Maternal II', 'Educação Infantil - Creche', '0 a 3 anos', 'tarde'),
(7, 'Pré-Escolar I', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'integral'),
(7, 'Pré-Escolar II', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'integral');

INSERT INTO turmas (escola_id, nome, etapa_ensino, faixa_etaria, turno) VALUES
(8, '1º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(8, '1º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(8, '2º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(8, '2º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(8, '3º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(8, '3º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(8, '4º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(8, '4º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(8, '5º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(8, '5º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde');,
(17, '6º Ano', 'Ensino Fundamental - Anos Finais', '12 a 14 anos', 'manhã'),
(17, '6º Ano', 'Ensino Fundamental - Anos Finais', '12 a 14 anos', 'tarde'),
(14, '7º Ano', 'Ensino Fundamental - Anos Finais', '12 a 14 anos', 'manhã'),
(14, '7º Ano', 'Ensino Fundamental - Anos Finais', '12 a 14 anos', 'tarde'),
(14, '8º Ano', 'Ensino Fundamental - Anos Finais', '12 a 14 anos', 'manhã'),
(14, '9º Ano', 'Ensino Fundamental - Anos Finais', '12 a 14 anos', 'manhã'),
(14, '9º Ano', 'Ensino Fundamental - Anos Finais', '12 a 14 anos', 'tarde');




-- escolas com ed. infantil até 5º ano do ensino fundamental

INSERT INTO turmas (escola_id, nome, etapa_ensino, faixa_etaria, turno) VALUES
(17, 'Maternal II', 'Educação Infantil - Creche', '0 a 3 anos', 'tarde'),
(17, 'Pré-Escolar I', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'integral'),
(17, 'Pré-Escolar II', 'Educação Infantil - Pré-Escolar', '4 a 5 anos', 'integral'),
(17, '1º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(17, '1º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(17, '2º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(17, '2º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(17, '3º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(17, '3º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(17, '4º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(17, '4º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde'),
(17, '5º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'manhã'),
(17, '5º Ano', 'Ensino Fundamental - Anos Iniciais', '6 a 11 anos', 'tarde');


INSERT INTO alunos (turma_id, identificador_anonimo) VALUES
(1, SHA2('siaae-demo-aluno', 256));

INSERT INTO cardapios (escola_id, dia_semana, etapa_ensino, turno, refeicao, nome_prato, ingredientes) VALUES
(1, WEEKDAY(CURRENT_DATE) + 1, 'Educação Infantil - Creche', 'manhã', 'Almoço', 'Arroz, feijão e frango assado', 'Arroz, feijão, frango, salada e banana');

INSERT INTO cardapio_ingredientes (cardapio_id, nome) VALUES
(1, 'Arroz'), (1, 'Feijão'), (1, 'Frango'), (1, 'Salada'), (1, 'Banana');
