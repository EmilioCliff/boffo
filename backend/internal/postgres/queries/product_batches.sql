-- name: CreateProductBatchRecord :one
INSERT INTO product_batches (product_id, batch_number, quantity, purchase_price, date_received)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListProductBatches :many
SELECT pb.*, p.name AS product_name, p.price AS product_price, p.unit AS product_unit, p.low_stock_threshold AS product_low_stock_threshold
FROM product_batches pb
JOIN products p ON p.id = pb.product_id
WHERE 
    (
        sqlc.narg('product_id')::bigint IS NULL
        OR pb.product_id = sqlc.narg('product_id')
    )
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
        OR LOWER(pb.batch_number) LIKE sqlc.narg('search')
    )
ORDER BY pb.date_received DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListProductBatchesCount :one
SELECT COUNT(*) AS total_batches
FROM product_batches pb
LEFT JOIN products p ON p.id = pb.product_id
WHERE 
    (
        sqlc.narg('product_id')::bigint IS NULL
        OR pb.product_id = sqlc.narg('product_id')
    )
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
        OR LOWER(pb.batch_number) LIKE sqlc.narg('search')
    );
