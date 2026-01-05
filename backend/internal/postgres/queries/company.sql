-- name: CreateCompanyStock :one
INSERT INTO company_stock (product_id)
VALUES ($1)
RETURNING *;

-- name: AddCompanyStock :one
UPDATE company_stock
SET quantity = quantity + sqlc.arg('quantity')
WHERE product_id = sqlc.arg('product_id')
RETURNING *;

-- name: RemoveCompanyStock :one
UPDATE company_stock
SET quantity = quantity - sqlc.arg('quantity')
WHERE product_id = sqlc.arg('product_id') AND quantity >= sqlc.arg('quantity')
RETURNING *;

-- name: ListCompanyStock :many
SELECT
    p.id AS product_id,
    p.name,
    p.category,
    p.unit,
    p.price,
    p.low_stock_threshold,
    p.description,
    cs.quantity AS company_quantity
FROM company_stock cs
JOIN products p ON p.id = cs.product_id
WHERE 
    (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('in_stock')::boolean IS NULL
        OR (sqlc.narg('in_stock') = true AND cs.quantity > 0)
        OR (sqlc.narg('in_stock') = false AND cs.quantity = 0)
    )
    AND p.deleted = false
ORDER BY p.name
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: ListCompanyStockCount :one
SELECT COUNT(*) AS total_items
FROM company_stock cs
JOIN products p ON p.id = cs.product_id
WHERE 
    (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(p.category) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('in_stock')::boolean IS NULL
        OR (sqlc.narg('in_stock') = true AND cs.quantity > 0)
        OR (sqlc.narg('in_stock') = false AND cs.quantity = 0)
    )
    AND p.deleted = false;