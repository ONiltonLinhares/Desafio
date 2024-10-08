CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    conta_origem BIGINT, -- Conta de onde sai o valor (NULL para depósitos)
    conta_destino BIGINT, -- Conta para onde vai o valor (NULL para saques)
    valor NUMERIC NOT NULL CHECK (valor > 0),
    tipo_transacao VARCHAR(20) NOT NULL,
    observacao TEXT,
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tipo_transacao CHECK (tipo_transacao IN ('deposito', 'saque', 'transferencia'))
);