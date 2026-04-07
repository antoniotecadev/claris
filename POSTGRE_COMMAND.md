# PostgreSQL e psql - comandos essenciais

## Entrar no PostgreSQL

```bash
# via Docker (container do projeto)
docker exec -it church-saas-db psql -U $DB_USER -d $DB_NAME

# via host local
psql -h localhost -p 5432 -U postgres -d postgres
```

## Comandos basicos do psql

```sql
\?                      -- ajuda dos comandos psql
\q                      -- sair
\conninfo               -- info da conexao atual
\x                      -- toggle modo expandido
	iming                 -- toggle tempo de execucao
```

## Databases

```sql
\l                      -- listar databases
\c nome_db              -- conectar a uma database
CREATE DATABASE nome_db;
DROP DATABASE nome_db;
```

## Tabelas e schema

```sql
\dn                     -- listar schemas
\dt                     -- listar tabelas do schema atual
\dt *.*                 -- listar tabelas de todos os schemas
\d nome_tabela          -- estrutura basica da tabela
\d+ nome_tabela         -- estrutura detalhada (tamanho, indices, etc)

CREATE TABLE exemplo (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(120) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE exemplo ADD COLUMN email VARCHAR(150);
DROP TABLE exemplo;
```

## Utilizadores e permissoes

```sql
\du                     -- listar roles/utilizadores

CREATE USER app_user WITH PASSWORD 'senha_forte';
ALTER USER app_user WITH SUPERUSER;
GRANT CONNECT ON DATABASE nome_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

## Queries essenciais

```sql
SELECT NOW();
SELECT version();

SELECT * FROM nome_tabela LIMIT 20;
SELECT COUNT(*) FROM nome_tabela;

INSERT INTO nome_tabela (coluna1, coluna2) VALUES ('valor1', 'valor2');
UPDATE nome_tabela SET coluna1 = 'novo_valor' WHERE id = 1;
DELETE FROM nome_tabela WHERE id = 1;
```

## Indices e performance basica

```sql
\di                     -- listar indices
CREATE INDEX idx_nome_tabela_coluna ON nome_tabela (coluna);
EXPLAIN SELECT * FROM nome_tabela WHERE coluna = 'x';
EXPLAIN ANALYZE SELECT * FROM nome_tabela WHERE coluna = 'x';
```

## Sequencias e IDs

```sql
\ds                     -- listar sequencias
SELECT last_value FROM nome_tabela_id_seq;
SELECT setval('nome_tabela_id_seq', 100, true);
```

## Backup e restore

```bash
# backup
pg_dump -h localhost -p 5432 -U postgres -d nome_db > backup.sql

# restore
psql -h localhost -p 5432 -U postgres -d nome_db < backup.sql
```

## Dica rapida para o projeto

```bash
# abrir psql do container
make psql

# listar tabelas
\dt

# ver estrutura de uma tabela
\d nome_tabela
```