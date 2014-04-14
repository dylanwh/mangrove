CREATE DOMAIN port_number AS integer CHECK (VALUE >= 0 AND VALUE < 65536);

CREATE TABLE ports (
    id                  SERIAL PRIMARY KEY,
    source_address      INET  NOT NULL,
    source_port         port_number NOT NULL,
    destination_address INET NOT NULL,
    destination_port    port_number NOT NULL
);
