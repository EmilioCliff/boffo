DROP TRIGGER IF EXISTS trg_recalc_stats ON products;
DROP FUNCTION IF EXISTS recalc_stats();

DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS movements;

ALTER TABLE products DROP COLUMN stock;

-- record stock additions by company
CREATE TABLE product_batches (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    batch_number VARCHAR(100) NOT NULL,
    quantity BIGINT NOT NULL,
    purchase_price NUMERIC(10,2) NOT NULL,
    date_received TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_batches_product_id ON product_batches (product_id);
CREATE INDEX idx_product_batches_batch_number ON product_batches (batch_number);
-- CREATE INDEX idx_product_batches_date_received ON product_batches (date_received);

CREATE TABLE company_stock (
    product_id BIGINT PRIMARY KEY REFERENCES products(id),
    quantity BIGINT NOT NULL DEFAULT 0
);

-- CREATE INDEX idx_company_stock_quantity ON company_stock (quantity);

-- record stock distribution to resellers
CREATE TABLE stock_distributions (
    id BIGSERIAL PRIMARY KEY,
    reseller_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    date_distributed TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stock_distributions_reseller_id ON stock_distributions (reseller_id);
CREATE INDEX idx_stock_distributions_product_id ON stock_distributions (product_id);
-- CREATE INDEX idx_stock_distributions_date ON stock_distributions (date_distributed);

CREATE TABLE reseller_stock (
    reseller_id BIGINT REFERENCES users(id),
    product_id BIGINT REFERENCES products(id),
    quantity BIGINT NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    PRIMARY KEY (reseller_id, product_id)
);

CREATE INDEX idx_reseller_stock_quantity ON reseller_stock (quantity);

-- record sales made by resellers
CREATE TABLE reseller_sales (
    id BIGSERIAL PRIMARY KEY,
    reseller_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    selling_price NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(12,2) GENERATED ALWAYS AS (quantity * selling_price) STORED,
    date_sold TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reseller_sales_reseller_id ON reseller_sales (reseller_id);
CREATE INDEX idx_reseller_sales_product_id ON reseller_sales (product_id);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    reseller_id BIGINT NOT NULL REFERENCES users(id),
    amount NUMERIC(12,2) NOT NULL,
    method VARCHAR(20) NOT NULL CHECK (method IN ('MPESA', 'CASH')),
    reference VARCHAR(100),
    recorded_by VARCHAR(20) NOT NULL CHECK (recorded_by IN ('SYSTEM', 'ADMIN')),
    date_paid TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_reseller_id ON payments (reseller_id);
CREATE INDEX idx_payments_date_paid ON payments (date_paid);
CREATE INDEX idx_payments_method ON payments (method);
CREATE INDEX idx_payments_recorded_by ON payments (recorded_by);

CREATE TABLE goods_requests (
    id BIGSERIAL PRIMARY KEY,
    reseller_id BIGINT NOT NULL REFERENCES users(id),
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    comment TEXT,
    cancelled BOOLEAN NOT NULL DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_goods_requests_reseller_id ON goods_requests (reseller_id);
CREATE INDEX idx_goods_requests_status ON goods_requests (status);

CREATE TABLE admin_stats (
    id INT PRIMARY KEY DEFAULT 1,
    total_company_stock BIGINT NOT NULL DEFAULT 0,
    total_stock_distributed BIGINT NOT NULL DEFAULT 0,
    total_value_distributed NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_payments_received NUMERIC(14,2) NOT NULL DEFAULT 0
);

INSERT INTO admin_stats (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE reseller_accounts (
    reseller_id BIGINT PRIMARY KEY REFERENCES users(id),
    total_stock_received BIGINT NOT NULL DEFAULT 0,
    total_value_received NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_sales_value NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_paid NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_cogs NUMERIC(14,2) NOT NULL DEFAULT 0,
    balance NUMERIC(14,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_reseller_accounts_balance ON reseller_accounts (balance);

CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    owner_type VARCHAR(20) NOT NULL CHECK (owner_type IN ('COMPANY', 'RESELLER')),
    owner_id BIGINT, -- NULL for COMPANY, reseller_id for RESELLER
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT')),
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    source VARCHAR(30) NOT NULL CHECK (source IN ('PURCHASE', 'DISTRIBUTION', 'SALE')),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stock_movements_product_id ON stock_movements (product_id);
CREATE INDEX idx_stock_movements_owner ON stock_movements (owner_type, owner_id);
CREATE INDEX idx_stock_movements_movement_type ON stock_movements (movement_type);
CREATE INDEX idx_stock_movements_source ON stock_movements (source);

CREATE TABLE batch_inventory (
    batch_id BIGINT PRIMARY KEY REFERENCES product_batches(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    remaining_quantity BIGINT NOT NULL CHECK (remaining_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_batch_inventory_product_id ON batch_inventory (product_id);
CREATE INDEX idx_batch_inventory_remaining ON batch_inventory (remaining_quantity);

CREATE TABLE stock_movement_batches (
    id BIGSERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL CHECK (owner IN ('COMPANY', 'RESELLER')),
    stock_movement_id BIGINT NOT NULL REFERENCES stock_movements(id) ON DELETE CASCADE,
    batch_id BIGINT NOT NULL REFERENCES product_batches(id),
    batch_number VARCHAR(100) NOT NULL,
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_smb_stock_movement ON stock_movement_batches (stock_movement_id);
CREATE INDEX idx_smb_batch ON stock_movement_batches (batch_id);

CREATE TABLE reseller_batch_inventory (
    id BIGSERIAL PRIMARY KEY,
    reseller_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    source_batch_id BIGINT NOT NULL REFERENCES product_batches(id),
    batch_number VARCHAR(100) NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL,
    remaining_quantity BIGINT NOT NULL CHECK (remaining_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rbi_reseller_product ON reseller_batch_inventory (reseller_id, product_id);
CREATE INDEX idx_rbi_remaining ON reseller_batch_inventory (remaining_quantity);
