-- name: CreateResellerSalesRecord :one
INSERT INTO reseller_sales (reseller_id, product_id, quantity, selling_price, date_sold)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListResellerSales :many
SELECT rs.*, p.name AS product_name,
    p.unit AS product_unit,
    p.category AS product_category
FROM reseller_sales rs
JOIN products p ON p.id = rs.product_id
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR rs.reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('product_id')::bigint IS NULL
        OR rs.product_id = sqlc.narg('product_id')
    )
ORDER BY rs.date_sold DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListResellerSalesCount :one
SELECT COUNT(*) AS total_sales
FROM reseller_sales rs
WHERE 
    (
        sqlc.narg('reseller_id')::bigint IS NULL
        OR rs.reseller_id = sqlc.narg('reseller_id')
    )
    AND (
        sqlc.narg('product_id')::bigint IS NULL
        OR rs.product_id = sqlc.narg('product_id')
    );