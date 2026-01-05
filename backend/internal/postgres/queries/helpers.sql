-- -- name: GetDashboardData :one
-- WITH low_stock AS (
--   SELECT id, name, stock, low_stock_threshold
--   FROM products
--   WHERE deleted = false
--   ORDER BY stock ASC
--   LIMIT 3
-- ),
-- recent_stock_in AS (
--   SELECT m.id, p.name AS product_name, m.quantity, m.price, m.created_at
--   FROM movements m
--   JOIN products p ON p.id = m.product_id
--   WHERE m.type = 'ADD'
--   ORDER BY m.created_at DESC
--   LIMIT 5
-- ),
-- recent_stock_out AS (
--   SELECT m.id, p.name AS product_name, m.quantity, m.price, m.created_at
--   FROM movements m
--   JOIN products p ON p.id = m.product_id
--   WHERE m.type = 'REMOVE'
--   ORDER BY m.created_at DESC
--   LIMIT 5
-- )
-- SELECT 
--   json_build_object(
--     'low_stock', (SELECT json_agg(low_stock) FROM low_stock),
--     'recent_stock_in', (SELECT json_agg(recent_stock_in) FROM recent_stock_in),
--     'recent_stock_out', (SELECT json_agg(recent_stock_out) FROM recent_stock_out)
--   ) AS dashboard_data;

-- -- name: GetWeeklySales :many
-- WITH date_series AS (
--   SELECT generate_series::date AS day
--   FROM generate_series(
--     (CURRENT_DATE - INTERVAL '6 days'),
--     CURRENT_DATE,
--     INTERVAL '1 day'
--   )
-- ),
-- sales_data AS (
--   SELECT
--     created_at::date AS day,
--     SUM(quantity) AS sales,
--     COUNT(*) AS total_transacted,
--     SUM(price * quantity) AS total_amount
--   FROM movements
--   WHERE type = 'REMOVE'
--     AND created_at >= NOW() - INTERVAL '7 days'
--   GROUP BY created_at::date
-- )
-- SELECT
--   to_char(ds.day, 'Dy') AS day,
--   COALESCE(sd.sales, 0) AS sales,
--   COALESCE(sd.total_transacted, 0) AS total_transacted,
--   COALESCE(sd.total_amount, 0) AS total_amount
-- FROM date_series ds
-- LEFT JOIN sales_data sd ON ds.day = sd.day
-- ORDER BY ds.day;

-- name: GetResellerNameByID :one
SELECT name FROM users
WHERE id = sqlc.arg('reseller_id');

-- name: UpdateAdminStats :one
UPDATE admin_stats
SET total_company_stock = coalesce(sqlc.narg('total_company_stock'), total_company_stock),
    total_stock_distributed = coalesce(sqlc.narg('total_stock_distributed'), total_stock_distributed),
    total_value_distributed = coalesce(sqlc.narg('total_value_distributed'), total_value_distributed),
    total_payments_received = coalesce(sqlc.narg('total_payments_received'), total_payments_received)
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: GetAdminStats :one
SELECT * FROM admin_stats
WHERE id = sqlc.arg('id');

-- name: GetTotalOutstandingPayments :one
SELECT COALESCE(SUM(balance), 0)::numeric AS total_outstanding_payments
FROM reseller_accounts;

-- name: GetTotalActiveResellers :one
SELECT COUNT(*) AS total_active_resellers
FROM users
WHERE role = 'staff' AND deleted = false;

-- name: GetTotalPendingGoodsRequests :one
SELECT COUNT(*) AS total_pending_requests
FROM goods_requests
WHERE status = 'PENDING' AND cancelled = false;

-- name: GetTotalLowStockProducts :one
SELECT COUNT(p.*) AS total_low_stock_products
FROM products p
JOIN company_stock cs ON cs.product_id = p.id
WHERE p.deleted = false AND cs.quantity <= p.low_stock_threshold;

-- name: ProductHelpers :many
SELECT id, name FROM products
WHERE deleted = false
ORDER BY name;

-- name: UserHelpers :many
SELECT id, name FROM users
WHERE deleted = false and role = 'staff'
ORDER BY name;

-- name: ResellerStockFormHelpers :many
SELECT p.id, p.name, rs.quantity, rs.low_stock_threshold
FROM products p
JOIN reseller_stock rs ON rs.product_id = p.id AND rs.reseller_id = sqlc.arg('reseller_id')
WHERE p.deleted = false
ORDER BY p.name;

-- name: CreateAlert :exec
INSERT INTO activities (title, description, type)
VALUES (sqlc.arg('title'), sqlc.arg('description'), sqlc.arg('type'))
RETURNING *;