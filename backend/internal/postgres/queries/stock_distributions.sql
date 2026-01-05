-- name: CreateStockDistributionRecord :one
INSERT INTO stock_distributions (reseller_id, product_id, quantity, unit_price, date_distributed)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListStockDistributions :many
SELECT sd.*, 
    p.name AS product_name,
    p.price AS product_price,
    p.unit AS product_unit,
    p.low_stock_threshold AS product_low_stock_threshold,
    u.name AS reseller_name,
    u.phone_number AS reseller_phone_number
FROM stock_distributions sd
LEFT JOIN products p ON p.id = sd.product_id
LEFT JOIN users u ON u.id = sd.reseller_id
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR sd.reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('product_id')::bigint IS NULL
        OR sd.product_id = sqlc.narg('product_id')
    )
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
    )
ORDER BY sd.date_distributed DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListStockDistributionsCount :one
SELECT COUNT(*) AS total_distributions
FROM stock_distributions sd
LEFT JOIN products p ON p.id = sd.product_id
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR sd.reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('product_id')::bigint IS NULL
        OR sd.product_id = sqlc.narg('product_id')
    )
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
    );