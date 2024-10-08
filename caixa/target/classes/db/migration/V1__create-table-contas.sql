CREATE TABLE contas (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    saldo NUMERIC NOT NULL DEFAULT 0,
    tipo TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupança'))
);