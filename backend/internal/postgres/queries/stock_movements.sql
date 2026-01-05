-- name: CreateStockMovementRecord :one
INSERT INTO stock_movements (product_id, owner_type, owner_id, movement_type, quantity, unit_price, source, note)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: ListStockMovements :many
SELECT sm.*, p.name AS product_name, p.unit AS product_unit, p.category AS product_category,
    u.name AS owner_name, u.phone_number AS owner_phone_number
FROM stock_movements sm
LEFT JOIN products p ON p.id = sm.product_id
LEFT JOIN users u ON u.id = sm.owner_id AND sm.owner_type = 'RESELLER'
WHERE 
    (
        sqlc.narg('owner_type')::text IS NULL
        OR sm.owner_type = sqlc.narg('owner_type')
    )
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(u.name) LIKE sqlc.narg('search')
        OR LOWER(p.name) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('owner_id')::bigint IS NULL
        OR sm.owner_id = sqlc.narg('owner_id')
    )
    AND (
        sqlc.narg('product_id')::bigint IS NULL
        OR sm.product_id = sqlc.narg('product_id')
    )
    AND (
        sqlc.narg('movement_type')::text IS NULL
        OR sm.movement_type = sqlc.narg('movement_type')
    )
    AND (
        sqlc.narg('source')::text IS NULL
        OR sm.source = sqlc.narg('source')
    )
ORDER BY sm.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListStockMovementsCount :one
SELECT COUNT(*) AS total_movements
FROM stock_movements sm
LEFT JOIN products p ON p.id = sm.product_id
LEFT JOIN users u ON u.id = sm.owner_id AND sm.owner_type = 'RESELLER'
WHERE 
    (
        sqlc.narg('owner_type')::text IS NULL
        OR sm.owner_type = sqlc.narg('owner_type')
    )
     AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(u.name) LIKE sqlc.narg('search')
        OR LOWER(p.name) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('owner_id')::bigint IS NULL
        OR sm.owner_id = sqlc.narg('owner_id')
    )
    AND (
        sqlc.narg('product_id')::bigint IS NULL
        OR sm.product_id = sqlc.narg('product_id')
    )
    AND (
        sqlc.narg('movement_type')::text IS NULL
        OR sm.movement_type = sqlc.narg('movement_type')
    )
    AND (
        sqlc.narg('source')::text IS NULL
        OR sm.source = sqlc.narg('source')
    );