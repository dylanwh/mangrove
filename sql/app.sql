CREATE DOMAIN port_number   AS INTEGER CHECK (VALUE >= 0 AND VALUE < 65536);

CREATE TABLE IF NOT EXISTS ports (
    id                  SERIAL PRIMARY KEY,
    description         TEXT,
    port                port_number NOT NULL,
    destination_address INET NOT NULL,
    destination_port    port_number NOT NULL
);
