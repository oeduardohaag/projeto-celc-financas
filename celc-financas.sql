CREATE TYPE tipo_sexo AS ENUM ('Masculino', 'Feminino');
CREATE TYPE tipo_estado_civil AS ENUM ('Solteiro', 'Casado', 'Divorciado', 'Viuvo', 'Separado');
CREATE TYPE tipo_metodo_pgto AS ENUM ('PIX', 'Dinheiro')
CREATE TYPE tipo_status_conta AS ENUM ('Não Pago', 'Pago', 'Atrasado')

CREATE TABLE diretoria (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	login VARCHAR(50) NOT NULL,
	senha VARCHAR(11) NOT NULL
	)

CREATE TABLE membros (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	cpf VARCHAR(14) NOT NULL,
	data_nascimento DATE NOT NULL,
	estado_civil tipo_estado_civil NOT NULL,
	sexo tipo_sexo NOT NULL,
	telefone varchar(100) NOT NULL,
	filhos INT DEFAULT 0
	)

CREATE TABLE ofertas (
	id SERIAL PRIMARY KEY,
	valor NUMERIC(10,2) NOT NULL,
	metodo_pgto tipo_metodo_pgto NOT NULL,
	data_pgto DATE NOT NULL,
	membro_id INT NOT NULL,
	FOREIGN KEY (membro_id) REFERENCES membros
)

CREATE TABLE dizimos (
	id SERIAL PRIMARY KEY,
	valor NUMERIC(10,2) NOT NULL,
	metodo_pgto tipo_metodo_pgto NOT NULL,
	data_pgto DATE NOT NULL,
	membro_id INT NOT NULL,
	FOREIGN KEY (membro_id) REFERENCES membros
)

CREATE TABLE contas (
	id SERIAL PRIMARY KEY,
	nome_conta VARCHAR(25) NOT NULL,
	valor NUMERIC(10,2) NOT NULL,
	status tipo_status_conta NOT NULL,
	data_vencimento DATE NOT NULL,
	data_pgto TIMESTAMP ,
	
	CONSTRAINT check_data_pgto CHECK (
		(status = 'Pago' AND data_pgto IS NOT NULL) OR
		(status != 'Pago' AND data_pgto IS NULL)	
	)
)
-------------------------------------------------------------------------------------------------------- 