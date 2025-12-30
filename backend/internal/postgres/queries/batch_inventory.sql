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