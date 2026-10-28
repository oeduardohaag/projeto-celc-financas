CREATE TYPE tipo_sexo AS ENUM ('Masculino', 'Feminino');
CREATE TYPE tipo_estado_civil AS ENUM ('Solteiro', 'Casado', 'Divorciado', 'Viuvo', 'Separado');
CREATE TYPE tipo_metodo_pgto AS ENUM ('PIX', 'Dinheiro', 'Crédito', 'Débito', 'Boleto');
CREATE TYPE tipo_status_conta AS ENUM ('Pendente', 'Pago', 'Atrasado');
CREATE TYPE tipo_categoria_conta AS ENUM ('Dízimo', 'Oferta', 'Transferencia', 'Desp. Administrativa', 'Energia', 'Limpeza', 'Água', 'Subsidio Pastoral');
CREATE TYPE tipo_classificacao_conta AS ENUM ('Receita', 'Despesa');

CREATE TABLE diretoria (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	login VARCHAR(50) NOT NULL,
	senha VARCHAR(255) NOT NULL
);

CREATE TABLE membros (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	cpf VARCHAR(11) NOT NULL,
	data_nascimento DATE NOT NULL,
	estado_civil tipo_estado_civil NOT NULL,
	sexo tipo_sexo NOT NULL,
	telefone varchar(100) NOT NULL,
	filhos INT DEFAULT 0
);

CREATE TABLE contas (
	id SERIAL PRIMARY KEY,
	nome_conta VARCHAR(25) NOT NULL,
	classificacao tipo_classificacao_conta NOT NULL,
	categoria tipo_categoria_conta NOT NULL,
	valor NUMERIC(10,2) NOT NULL,
	status tipo_status_conta NOT NULL,
	data_vencimento DATE NOT NULL,
	data_pgto TIMESTAMP,
	membro_id INT REFERENCES membros(id) ON DELETE SET NULL,
	
	CONSTRAINT check_data_pgto CHECK (
		(status = 'Pago' AND data_pgto IS NOT NULL) OR
		(status != 'Pago' AND data_pgto IS NULL)	
	)
);
-------------------------------------------------------------------------------------------------------- 
-- Inputs para Testes
-- 1. Inserts para a tabela diretoria

-- Nota: A senha abaixo é um hash bcrypt válido correspondente a "123456" para testes de login.
-- Para gerar o hash no terminal: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('123456', 10).then(hash => console.log('\nHASH GERADO:', hash));"
SELECT * FROM diretoria

INSERT INTO public.diretoria (nome, login, senha) 
VALUES ('Administrador Teste', 'teste.1', '$2b$10$t0.pE9DAvBxYWoX.AqvzZ.A9DcR.1Z9o8exZOb89rKQ6nF/HPPnBC')
ON CONFLICT (login) DO NOTHING;

-- 2. Inserts para a tabela membros
SELECT * FROM membros

INSERT INTO membros (nome, cpf, data_nascimento, estado_civil, sexo, telefone, filhos) VALUES
('Carlos Silva', '12345678901', '1985-03-12', 'Casado', 'Masculino', '(48) 99888-1111', 2),
('Ana Souza', '23456789012', '1990-07-22', 'Solteiro', 'Feminino', '(48) 99888-2222', 0),
('Roberto Santos', '34567890123', '1975-11-05', 'Casado', 'Masculino', '(48) 99888-3333', 3),
('Juliana Oliveira', '45678901234', '1992-01-18', 'Divorciado', 'Feminino', '(48) 99888-4444', 1),
('Marcos Pereira', '56789012345', '1988-09-30', 'Solteiro', 'Masculino', '(48) 99888-5555', 0),
('Beatriz Lima', '67890123456', '1995-12-04', 'Casado', 'Feminino', '(48) 99888-6666', 1),
('Paulo Rocha', '78901234567', '1980-06-15', 'Viuvo', 'Masculino', '(48) 99888-7777', 2),
('Fernanda Costa', '89012345678', '1998-04-25', 'Solteiro', 'Feminino', '(48) 99888-8888', 0),
('Lucas Martins', '90123456789', '1983-10-09', 'Casado', 'Masculino', '(48) 99888-9999', 4),
('Camila Ribeiro', '01234567890', '1991-08-19', 'Separado', 'Feminino', '(48) 99888-0000', 1);

-- 3. Inserts para a tabela contas
SELECT * FROM contas

INSERT INTO contas (nome_conta, classificacao, categoria, valor, status, data_vencimento, data_pgto, membro_id) VALUES
('Dízimo Outubro', 'Receita', 'Dízimo', 350.00, 'Pago', '2025-10-10', '2025-10-10 14:30:00', 1),
('Oferta Culto', 'Receita', 'Oferta', 150.50, 'Pago', '2025-10-12', '2025-10-12 20:15:00', 2),
('Energia Elet.', 'Despesa', 'Energia', 420.00, 'Pendente', '2025-11-05', NULL, NULL),
('Conta de Água', 'Despesa', 'Água', 180.30, 'Atrasado', '2025-09-20', NULL, NULL),
('Limpeza Igreja', 'Despesa', 'Limpeza', 250.00, 'Pago', '2025-10-01', '2025-10-01 09:00:00', 3),
('Dízimo Nov', 'Receita', 'Dízimo', 500.00, 'Pendente', '2025-11-10', NULL, 4),
('Desp. Admin', 'Despesa', 'Desp. Administrativa', 300.00, 'Pago', '2025-10-15', '2025-10-15 16:45:00', NULL),
('Subs. Pastoral', 'Despesa', 'Subsidio Pastoral', 2500.00, 'Pago', '2025-10-05', '2025-10-05 10:00:00', 5),
('Oferta Missões', 'Receita', 'Oferta', 200.00, 'Pago', '2025-10-18', '2025-10-18 21:00:00', 6),
('Taxa Transf.', 'Receita', 'Transferencia', 1000.00, 'Pago', '2025-10-20', '2025-10-20 11:30:00', NULL);