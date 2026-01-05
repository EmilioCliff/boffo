-- name: CreateStockMovementBatchRecord :one
INSERT INTO stock_movement_batches (owner, batch_number, stock_movement_id, batch_id, quantity, unit_cost)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: ListStockMovementBatchesByBatchID :many
SELECT smb.*
FROM stock_movement_batches smb
WHERE smb.batch_id = sqlc.arg('batch_id')
ORDER BY smb.created_at DESC;

-- name: ListStockMovementBatchesByStockMovementID :many
SELECT smb.*
FROM stock_movement_batches smb
WHERE smb.stock_movement_id = sqlc.arg('stock_movement_id')
ORDER BY smb.created_at DESC;