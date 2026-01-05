-- DROP TABLE IF EXISTS reseller_accounts;
-- DROP TABLE IF EXISTS admin_stats;

-- DROP TABLE IF EXISTS goods_requests;
-- DROP TABLE IF EXISTS payments;
-- DROP TABLE IF EXISTS reseller_sales;

-- DROP TABLE IF EXISTS reseller_stock;
-- DROP TABLE IF EXISTS stock_distributions;

-- DROP TABLE IF EXISTS company_stock;

-- DROP TABLE IF EXISTS batch_inventory;
-- DROP TABLE IF EXISTS stock_movements_batches;
-- DROP TABLE IF EXISTS reseller_batch_inventory;

-- DROP TABLE IF EXISTS product_batches;
-- DROP TABLE IF EXISTS stock_movements;

-- ALTER TABLE products
-- ADD COLUMN stock BIGINT NOT NULL DEFAULT 0;

-- CREATE TABLE "movements" (
--     id bigserial PRIMARY KEY,
--     product_id bigint NOT NULL,
--     quantity integer NOT NULL,
--     price numeric(10,2) NOT NULL,
--     type varchar(50) NOT NULL CHECK (type IN ('ADD', 'REMOVE')),
--     note text,
--     batch_number varchar(100),
--     performed_by bigint NOT NULL,
--     created_at timestamptz NOT NULL DEFAULT (now()),

--     CONSTRAINT movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
--     CONSTRAINT movements_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES users (id)
-- );

-- CREATE TABLE "stats" (
--     id integer PRIMARY KEY,
--     total_users bigint NOT NULL DEFAULT 0,
--     total_products bigint NOT NULL DEFAULT 0,
--     total_low_stock bigint NOT NULL DEFAULT 0,
--     total_out_of_stock bigint NOT NULL DEFAULT 0,
--     total_stocks_added bigint NOT NULL DEFAULT 0,
--     total_stocks_added_value numeric(10,2) NOT NULL DEFAULT 0,
--     total_stocks_removed bigint NOT NULL DEFAULT 0,
--     total_stocks_removed_value numeric(10,2) NOT NULL DEFAULT 0,
--     total_value numeric(14,2) NOT NULL DEFAULT 0
-- );

-- INSERT INTO stats (id)
-- VALUES (1)
-- ON CONFLICT (id) DO NOTHING;

-- CREATE OR REPLACE FUNCTION recalc_stats()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE stats
--   SET
--       total_low_stock = subquery.low_stock,
--       total_out_of_stock = subquery.out_of_stock,
--       total_value = subquery.total_value
--   FROM (
--       SELECT
--           COUNT(*) FILTER (WHERE stock > 0 AND stock <= low_stock_threshold AND deleted = false) AS low_stock,
--           COUNT(*) FILTER (WHERE stock <= 0 AND deleted = false) AS out_of_stock,
--           COALESCE(SUM(price * stock), 0) AS total_value
--       FROM products
--       WHERE deleted = false
--   ) AS subquery
--   WHERE stats.id = 1;

--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trg_recalc_stats
-- AFTER UPDATE OF price, deleted, low_stock_threshold ON products
-- FOR EACH STATEMENT
-- EXECUTE FUNCTION recalc_stats();


-- =========================
-- DROP NEW STOCK SYSTEM
-- =========================

-- child tables first
DROP TABLE IF EXISTS stock_movement_batches;
DROP TABLE IF EXISTS reseller_batch_inventory;
DROP TABLE IF EXISTS batch_inventory;

DROP TABLE IF EXISTS stock_movements;

DROP TABLE IF EXISTS reseller_accounts;
DROP TABLE IF EXISTS admin_stats;

DROP TABLE IF EXISTS goods_requests;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reseller_sales;

DROP TABLE IF EXISTS reseller_stock;
DROP TABLE IF EXISTS stock_distributions;

DROP TABLE IF EXISTS company_stock;
DROP TABLE IF EXISTS product_batches;

-- =========================
-- RESTORE OLD PRODUCTS STOCK
-- =========================

ALTER TABLE products
ADD COLUMN stock BIGINT NOT NULL DEFAULT 0;

-- =========================
-- RESTORE OLD MOVEMENTS TABLE
-- =========================

CREATE TABLE movements (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ADD', 'REMOVE')),
    note TEXT,
    batch_number VARCHAR(100),
    performed_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- RESTORE OLD STATS TABLE
-- =========================

CREATE TABLE stats (
    id INTEGER PRIMARY KEY,
    total_users BIGINT NOT NULL DEFAULT 0,
    total_products BIGINT NOT NULL DEFAULT 0,
    total_low_stock BIGINT NOT NULL DEFAULT 0,
    total_out_of_stock BIGINT NOT NULL DEFAULT 0,
    total_stocks_added BIGINT NOT NULL DEFAULT 0,
    total_stocks_added_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_stocks_removed BIGINT NOT NULL DEFAULT 0,
    total_stocks_removed_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_value NUMERIC(14,2) NOT NULL DEFAULT 0
);

INSERT INTO stats (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- RESTORE STATS FUNCTION & TRIGGER
-- =========================

CREATE OR REPLACE FUNCTION recalc_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stats
  SET
      total_low_stock = subquery.low_stock,
      total_out_of_stock = subquery.out_of_stock,
      total_value = subquery.total_value
  FROM (
      SELECT
          COUNT(*) FILTER (WHERE stock > 0 AND stock <= low_stock_threshold AND deleted = false) AS low_stock,
          COUNT(*) FILTER (WHERE stock <= 0 AND deleted = false) AS out_of_stock,
          COALESCE(SUM(price * stock), 0) AS total_value
      FROM products
      WHERE deleted = false
  ) AS subquery
  WHERE stats.id = 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalc_stats
AFTER UPDATE OF price, deleted, low_stock_threshold ON products
FOR EACH STATEMENT
EXECUTE FUNCTION recalc_stats();