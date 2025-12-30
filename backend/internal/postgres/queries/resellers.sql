-- name: CheckResellerStockExists :one
SELECT EXISTS (
    SELECT 1 FROM reseller_stock
    WHERE reseller_id = $1 AND product_id = $2
);

-- name: CreateResellerStock :one
INSERT INTO reseller_stock (reseller_id, product_id, quantity)
VALUES ($1, $2, $3)
RETURNING *;

-- name: AddResellerStockQuantity :one
UPDATE reseller_stock
SET quantity = quantity + $3
WHERE reseller_id = $1 AND product_id = $2
RETURNING *;

-- name: SubtractResellerStockQuantity :one
UPDATE reseller_stock
SET quantity = GREATEST(quantity - $3, 0)
WHERE reseller_id = $1 AND product_id = $2
RETURNING *;

-- name: UpdateResellerStockThreshold :one
UPDATE reseller_stock
SET low_stock_threshold = $3
WHERE reseller_id = $1 AND product_id = $2
RETURNING *;

-- name: ListResellerStock :many
SELECT 
    rs.*, 
    p.id AS product_id,
    p.name,
    p.category,
    p.unit,
    p.price,
    p.low_stock_threshold
FROM reseller_stock rs
JOIN products p ON p.id = rs.product_id
WHERE 
    (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
    )
     AND (
        sqlc.narg('in_stock')::boolean IS NULL
        OR (sqlc.narg('in_stock') = true AND rs.quantity > 0)
        OR (sqlc.narg('in_stock') = false AND rs.quantity = 0)
    )
    AND (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR rs.reseller_id = sqlc.narg('reseller_id')::bigint
    )
    -- AND rs.reseller_id = sqlc.arg('reseller_id')
ORDER BY p.name
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListResellerStockCount :one
SELECT COUNT(*) AS total_items
FROM reseller_stock rs
JOIN products p ON p.id = rs.product_id
WHERE 
    (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
    )
     AND (
        sqlc.narg('in_stock')::boolean IS NULL
        OR (sqlc.narg('in_stock') = true AND rs.quantity > 0)
        OR (sqlc.narg('in_stock') = false AND rs.quantity = 0)
    )
    AND (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR rs.reseller_id = sqlc.narg('reseller_id')::bigint
    );
    
-- name: CreateResellerAccount :one
INSERT INTO reseller_accounts (reseller_id)
VALUES ($1)
RETURNING *;

-- name: GetResellerAccount :one
SELECT * FROM reseller_accounts
WHERE reseller_id = $1;

-- name: UpdateResellerAccount :one
UPDATE reseller_accounts
SET total_stock_received = coalesce(sqlc.narg('total_stock_received'), total_stock_received),
    total_value_received = coalesce(sqlc.narg('total_value_received'), total_value_received),
    total_sales_value = coalesce(sqlc.narg('total_sales_value'), total_sales_value),
    total_paid = coalesce(sqlc.narg('total_paid'), total_paid),
    total_cogs = coalesce(sqlc.narg('total_cogs'), total_cogs),
    balance = coalesce(sqlc.narg('balance'), balance)
WHERE reseller_id = sqlc.arg('reseller_id')
RETURNING *;