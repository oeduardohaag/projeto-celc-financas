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