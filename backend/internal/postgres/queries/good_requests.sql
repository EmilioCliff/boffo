-- name: CreateGoodsRequest :one
INSERT INTO goods_requests (reseller_id, payload, status)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateGoodsRequestAdmin :one
UPDATE goods_requests
SET status = coalesce(sqlc.narg('status'), status),
    comment = coalesce(sqlc.narg('comment'), comment),
    updated_at = now()
WHERE id = sqlc.arg('id') AND cancelled = false
RETURNING *;

-- name: UpdateGoodsRequestPayload :one
UPDATE goods_requests
SET payload = sqlc.arg('payload'),
    updated_at = now()
WHERE id = sqlc.arg('id') AND cancelled = false
RETURNING *;

-- name: CancelGoodsRequest :one
UPDATE goods_requests
SET cancelled = true,
    cancelled_at = now(),
    updated_at = now()
WHERE id = $1 AND cancelled = false
RETURNING *;

-- name: ListGoodsRequestsByReseller :many
SELECT * FROM goods_requests 
WHERE reseller_id = sqlc.arg('reseller_id')
    AND (
        sqlc.narg('status')::text IS NULL
        OR status = sqlc.narg('status')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListGoodsRequestsByResellerCount :one
SELECT COUNT(*) AS total_requests
FROM goods_requests 
WHERE reseller_id = sqlc.arg('reseller_id')
    AND (
         sqlc.narg('status')::text IS NULL
        OR status = sqlc.narg('status')
    );

-- name: ListGoodsRequestsByAdmin :many
SELECT gr.*, u.name, u.phone_number FROM goods_requests gr
JOIN users u ON u.id = gr.reseller_id
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR gr.reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('status')::text IS NULL
        OR gr.status = sqlc.narg('status')
    )
ORDER BY gr.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListGoodsRequestsByAdminCount :one
SELECT COUNT(*) AS total_requests
FROM goods_requests 
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('status')::text IS NULL
        OR status = sqlc.narg('status')
    );