-- name: CreateResellerBatchInventoryRecord :one
INSERT INTO reseller_batch_inventory (
          reseller_id,
          product_id,
          source_batch_id,
          batch_number,
          remaining_quantity,
          unit_cost
      )
VALUES  ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: ListResellerBatchInventoryForUpdate :many
SELECT rbi.*, pb.batch_number
FROM reseller_batch_inventory rbi
JOIN product_batches pb ON pb.id = rbi.source_batch_id
WHERE 
    rbi.reseller_id = sqlc.arg('reseller_id')
    AND rbi.product_id = sqlc.arg('product_id')
    AND rbi.remaining_quantity > 0
ORDER BY pb.date_received ASC
FOR UPDATE;

-- name: GetResellerBatchInventoryProductSum :one
SELECT COALESCE(SUM(remaining_quantity), 0)::bigint AS total_remaining
FROM reseller_batch_inventory
WHERE reseller_id = sqlc.arg('reseller_id')
      AND product_id = sqlc.arg('product_id')
      AND remaining_quantity > 0;

-- name: RemoveResellerBatchInventoryQuantity :one
UPDATE reseller_batch_inventory
SET remaining_quantity = remaining_quantity - sqlc.arg('quantity')
WHERE id = sqlc.arg('inventory_id')
  AND remaining_quantity >= sqlc.arg('quantity')
RETURNING *;
