-- name: CreatePayment :one
INSERT INTO payments (reseller_id, amount, method, reference, recorded_by, date_paid)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: ListPayments :many
SELECT p.*, u.name, u.phone_number FROM payments p
JOIN users u ON u.id = p.reseller_id
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR p.reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('method')::text IS NULL
        OR p.method = sqlc.narg('method')
    )
    AND (
        sqlc.narg('recorded_by')::text IS NULL
        OR p.recorded_by = sqlc.narg('recorded_by')
    )
    AND (
        sqlc.narg('date_from')::date IS NULL
        OR p.date_paid::date >= sqlc.narg('date_from')
    )
    AND (
        sqlc.narg('date_to')::date IS NULL
        OR p.date_paid::date <= sqlc.narg('date_to')
    )
ORDER BY p.date_paid DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListPaymentsCount :one
SELECT COUNT(*) AS total_payments
FROM payments p
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR p.reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('method')::text IS NULL
        OR p.method = sqlc.narg('method')
    )
    AND (
        sqlc.narg('recorded_by')::text IS NULL
        OR p.recorded_by = sqlc.narg('recorded_by')
    )
    AND (
        sqlc.narg('date_from')::date IS NULL
        OR p.date_paid::date >= sqlc.narg('date_from')
    )
    AND (
        sqlc.narg('date_to')::date IS NULL
        OR p.date_paid::date <= sqlc.narg('date_to')
    );