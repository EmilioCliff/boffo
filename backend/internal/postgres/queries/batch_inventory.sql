-- name: CreateBatchInventoryRecord :one
INSERT INTO batch_inventory (batch_id, product_id, remaining_quantity)
VALUES ($1, $2, $3)
RETURNING *;

-- name: AddBatchInventoryQuantity :one
UPDATE batch_inventory
SET remaining_quantity = remaining_quantity + sqlc.arg('quantity')
WHERE batch_id = sqlc.arg('batch_id') AND product_id = sqlc.arg('product_id')
RETURNING *;

-- name: RemoveBatchInventoryQuantity :one
UPDATE batch_inventory
SET remaining_quantity = remaining_quantity - sqlc.arg('quantity')
WHERE batch_id = sqlc.arg('batch_id') AND product_id = sqlc.arg('product_id') AND remaining_quantity >= sqlc.arg('quantity')
RETURNING *;

-- name: GetBatchInventoryProductSum :one
SELECT COALESCE(SUM(remaining_quantity), 0)::bigint AS total_remaining
FROM batch_inventory
WHERE product_id = sqlc.arg('product_id')
      AND remaining_quantity > 0;

-- name: ListBatchInventoryForUpdate :many
SELECT 
    bi.*,
    pb.batch_number
FROM batch_inventory bi
JOIN product_batches pb ON pb.id = bi.batch_id
WHERE 
    bi.product_id = sqlc.arg('product_id')
    AND bi.remaining_quantity > 0
ORDER BY pb.date_received ASC
FOR UPDATE;

-- name: ListBatchInventory :many
SELECT pb.*, p.name AS product_name, bi.remaining_quantity, p.price AS product_price, p.unit AS product_unit, p.low_stock_threshold AS product_low_stock_threshold, p.category AS product_category
FROM product_batches pb
JOIN products p ON p.id = pb.product_id
JOIN batch_inventory bi ON bi.batch_id = pb.id
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
    AND (
        sqlc.narg('in_stock')::boolean IS NULL
        OR (sqlc.narg('in_stock') = true AND bi.remaining_quantity > 0)
        OR (sqlc.narg('in_stock') = false AND bi.remaining_quantity = 0)
    )
ORDER BY pb.date_received DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListBatchInventoryCount :one
SELECT COUNT(*) AS total_batches
FROM product_batches pb
LEFT JOIN products p ON p.id = pb.product_id
JOIN batch_inventory bi ON bi.batch_id = pb.id
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
    AND (
        sqlc.narg('in_stock')::boolean IS NULL
        OR (sqlc.narg('in_stock') = true AND bi.remaining_quantity > 0)
        OR (sqlc.narg('in_stock') = false AND bi.remaining_quantity = 0)
    );
