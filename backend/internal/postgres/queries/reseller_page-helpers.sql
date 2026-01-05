-- name: GetResellerDashboardData :one
WITH current_stock AS (
  SELECT COALESCE(SUM(rs.quantity), 0)::bigint AS total_units
  FROM reseller_stock rs
  WHERE rs.reseller_id = sqlc.arg('reseller_id')
),
total_sales AS (
  SELECT 
    COALESCE(SUM(quantity), 0)::bigint AS units_sold,
    COALESCE(SUM(total_amount), 0)::numeric AS sales_value
  FROM reseller_sales
  WHERE reseller_id = sqlc.arg('reseller_id')
),
account_balance AS (
  SELECT COALESCE(balance, 0)::numeric AS outstanding_balance
  FROM reseller_accounts
  WHERE reseller_id = sqlc.arg('reseller_id')
),
profit AS (
  SELECT 
    COALESCE(total_sales_value - total_cogs, 0)::numeric AS total_profit
  FROM reseller_accounts
  WHERE reseller_id = sqlc.arg('reseller_id')
),
top_stock AS (
  SELECT 
    p.id,
    p.name,
    rs.quantity,
    rs.low_stock_threshold
  FROM reseller_stock rs
  JOIN products p ON p.id = rs.product_id
  WHERE rs.reseller_id = sqlc.arg('reseller_id')
    AND p.deleted = false
  LIMIT 4
),
recent_sales AS (
  SELECT 
    rs.id,
    p.name AS product_name,
    rs.quantity,
    rs.selling_price,
    rs.total_amount,
    rs.date_sold
  FROM reseller_sales rs
  JOIN products p ON p.id = rs.product_id
  WHERE rs.reseller_id = sqlc.arg('reseller_id')
  ORDER BY rs.date_sold DESC
  LIMIT 3
)
SELECT 
  json_build_object(
    'current_stock', (SELECT total_units FROM current_stock),
    'total_sales', json_build_object(
      'units_sold', (SELECT units_sold FROM total_sales),
      'sales_value', (SELECT sales_value FROM total_sales)
    ),
    'outstanding_balance', (SELECT outstanding_balance FROM account_balance),
    'profit', (SELECT total_profit FROM profit),
    'stock_overview', (SELECT COALESCE(json_agg(top_stock), '[]'::json) FROM top_stock),
    'recent_sales', (SELECT COALESCE(json_agg(recent_sales), '[]'::json) FROM recent_sales)
  ) AS dashboard_data;

-- name: GetResellerStockPageStats :one
WITH total_units AS (
  SELECT COALESCE(SUM(rs.quantity), 0)::bigint AS total_units
  FROM reseller_stock rs
  WHERE rs.reseller_id = sqlc.arg('reseller_id')
),
total_value AS (
  SELECT COALESCE(SUM(rbi.remaining_quantity * rbi.unit_cost), 0)::numeric AS stock_value
  FROM reseller_batch_inventory rbi
  WHERE rbi.reseller_id = sqlc.arg('reseller_id')
    AND rbi.remaining_quantity > 0
),
low_stock AS (
  SELECT COUNT(*)::bigint AS low_stock_count
  FROM reseller_stock rs
  WHERE rs.reseller_id = sqlc.arg('reseller_id')
    AND rs.quantity <= rs.low_stock_threshold
)
SELECT 
  json_build_object(
    'total_units', (SELECT total_units FROM total_units),
    'total_value', (SELECT stock_value FROM total_value),
    'total_low_stock', (SELECT low_stock_count FROM low_stock)
  ) AS stock_stats;

-- name: GetResellerSalesPageStats :one
SELECT 
  json_build_object(
    'total_units_sold', COALESCE(SUM(rs.quantity), 0)::bigint,
    'total_sales_value', COALESCE(SUM(rs.total_amount), 0)::numeric
  ) AS sales_stats
FROM reseller_sales rs
WHERE rs.reseller_id = sqlc.arg('reseller_id');

-- name: GetResellerGoodsRequestsPageStats :one
SELECT 
  json_build_object(
    'total_requests', COUNT(*)::bigint,
    'pending_requests', COUNT(*) FILTER (WHERE status = 'PENDING')::bigint,
    'approved_requests', COUNT(*) FILTER (WHERE status = 'APPROVED')::bigint,
    'rejected_requests', COUNT(*) FILTER (WHERE status = 'REJECTED')::bigint
  ) AS goods_requests_stats
FROM goods_requests
WHERE reseller_id = sqlc.arg('reseller_id') AND cancelled = false;