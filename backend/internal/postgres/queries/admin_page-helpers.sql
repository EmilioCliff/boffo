-- name: GetAdminProductsPageStats :one
WITH total_stock AS (
  SELECT COALESCE(SUM(cs.quantity), 0)::bigint AS total_units
  FROM company_stock cs
),
low_stock_items AS (
  SELECT COUNT(*)::bigint AS low_stock_count
  FROM products p
  JOIN company_stock cs ON cs.product_id = p.id
  WHERE p.deleted = false AND cs.quantity <= p.low_stock_threshold
),
out_of_stock AS (
  SELECT COUNT(*)::bigint AS out_of_stock_count
  FROM products p
  JOIN company_stock cs ON cs.product_id = p.id
  WHERE p.deleted = false AND cs.quantity = 0
)
SELECT 
  json_build_object(
    'total_units', (SELECT total_units FROM total_stock),
    'low_stock_items', (SELECT low_stock_count FROM low_stock_items),
    'out_of_stock', (SELECT out_of_stock_count FROM out_of_stock)
  ) AS products_stats;

-- name: GetAdminBatchesPageStats :one
WITH total_batches AS (
  SELECT COUNT(*)::bigint AS batch_count
  FROM product_batches
),
active_batches AS (
  SELECT COUNT(DISTINCT pb.id)::bigint AS active_count
  FROM product_batches pb
  JOIN batch_inventory bi ON bi.batch_id = pb.id
  WHERE bi.remaining_quantity > 0
),
total_value AS (
  SELECT COALESCE(SUM(pb.quantity * pb.purchase_price), 0)::numeric AS batch_value
  FROM product_batches pb
),
remaining_value AS (
  SELECT COALESCE(SUM(bi.remaining_quantity * pb.purchase_price), 0)::numeric AS remaining_stock_value
  FROM batch_inventory bi
  JOIN product_batches pb ON pb.id = bi.batch_id
  WHERE bi.remaining_quantity > 0
)
SELECT 
  json_build_object(
    'total_batches', (SELECT batch_count FROM total_batches),
    'active_batches', (SELECT active_count FROM active_batches),
    'total_value', (SELECT batch_value FROM total_value),
    'remaining_value', (SELECT remaining_stock_value FROM remaining_value)
  ) AS batches_stats;

-- name: GetAdminDistributionPageStats :one
WITH total_distributions AS (
  SELECT COUNT(*)::bigint AS distribution_count
  FROM stock_distributions
),
units_distributed AS (
  SELECT COALESCE(SUM(quantity), 0)::bigint AS units
  FROM stock_distributions
),
total_value AS (
  SELECT COALESCE(SUM(total_price), 0)::numeric AS value
  FROM stock_distributions
),
active_resellers_count AS (
  SELECT COUNT(DISTINCT reseller_id)::bigint AS reseller_count
  FROM stock_distributions
)
SELECT 
  json_build_object(
    'total_distribution', (SELECT distribution_count FROM total_distributions),
    'units_distributed', (SELECT units FROM units_distributed),
    'total_value', (SELECT value FROM total_value),
    'active_resellers', (SELECT reseller_count FROM active_resellers_count)
  ) AS distribution_stats;

-- name: GetAdminGoodsRequestsPageStats :one
WITH request_stats AS (
  SELECT 
    COUNT(*)::bigint AS total_requests,
    COUNT(*) FILTER (WHERE status = 'PENDING' AND cancelled = false)::bigint AS pending,
    COUNT(*) FILTER (WHERE status = 'APPROVED' AND cancelled = false)::bigint AS approved,
    COUNT(*) FILTER (WHERE status = 'REJECTED' AND cancelled = false)::bigint AS rejected,
    COUNT(*) FILTER (WHERE cancelled = true)::bigint AS cancelled
  FROM goods_requests
)
SELECT 
  json_build_object(
    'total_pending', (SELECT pending FROM request_stats),
    'total_approved', (SELECT approved FROM request_stats),
    'total_cancelled', (SELECT cancelled FROM request_stats),
    'total_rejected', (SELECT rejected FROM request_stats)
  ) AS goods_requests_stats;

-- name: GetAdminPaymentsPageStats :one
WITH payment_stats AS (
  SELECT 
    COUNT(*)::bigint AS total_payments,
    COALESCE(SUM(amount), 0)::numeric AS total_amount_received,
    COALESCE(SUM(amount) FILTER (WHERE method = 'MPESA'), 0)::numeric AS mpesa_total,
    COALESCE(SUM(amount) FILTER (WHERE method = 'CASH'), 0)::numeric AS cash_total
  FROM payments
)
SELECT 
  json_build_object(
    'total_payments', (SELECT total_payments FROM payment_stats),
    'total_received', (SELECT total_amount_received FROM payment_stats),
    'mpesa_total', (SELECT mpesa_total FROM payment_stats),
    'cash_total', (SELECT cash_total FROM payment_stats)
  ) AS payments_stats;

-- name: GetAdminResellersPageStats :one
WITH reseller_counts AS (
  SELECT COUNT(*)::bigint AS total_count
  FROM users
  WHERE role = 'staff' AND deleted = false
),
active_resellers AS (
  SELECT COUNT(DISTINCT reseller_id)::bigint AS active_count
  FROM reseller_stock
  WHERE quantity > 0
),
total_stock_out AS (
  SELECT COALESCE(SUM(quantity), 0)::bigint AS total_units
  FROM reseller_stock
),
outstanding_balance AS (
  SELECT COALESCE(SUM(balance), 0)::numeric AS total_balance
  FROM reseller_accounts
  WHERE balance > 0
)
SELECT 
  json_build_object(
    'total_resellers', (SELECT total_count FROM reseller_counts),
    'active_resellers', (SELECT active_count FROM active_resellers),
    'total_stock_out', (SELECT total_units FROM total_stock_out),
    'outstanding_payments', (SELECT total_balance FROM outstanding_balance)
  ) AS resellers_stats;

-- name: GetAdminStockMovementsPageStats :one
WITH movement_stats AS (
  SELECT 
    COUNT(*)::bigint AS total_movements,
    COALESCE(SUM(quantity) FILTER (WHERE movement_type = 'IN'), 0)::bigint AS stock_in,
    COALESCE(SUM(quantity) FILTER (WHERE movement_type = 'OUT'), 0)::bigint AS stock_out
  FROM stock_movements
)
SELECT 
  json_build_object(
    'total_movements', (SELECT total_movements FROM movement_stats),
    'total_stock_in', (SELECT stock_in FROM movement_stats),
    'total_stock_out', (SELECT stock_out FROM movement_stats),
    'net_movement', (
      SELECT (stock_in - stock_out)::bigint
      FROM movement_stats
    )
  ) AS stock_movements_stats;

-- name: GetAdminDashboardStats :one
WITH company_stock_total AS (
  SELECT COALESCE(SUM(quantity), 0)::bigint AS total_stock
  FROM company_stock
),
distribution_units AS (
  SELECT COALESCE(SUM(quantity), 0)::bigint AS units
  FROM stock_distributions
),
distribution_value AS (
  SELECT COALESCE(SUM(total_price), 0)::numeric AS value
  FROM stock_distributions
),
payments_received AS (
  SELECT COALESCE(SUM(amount), 0)::numeric AS total
  FROM payments
),
low_stock_products AS (
  SELECT COUNT(*)::bigint AS low_stock_count
  FROM products p
  JOIN company_stock cs ON cs.product_id = p.id
  WHERE p.deleted = false AND cs.quantity <= p.low_stock_threshold
),
pending_requests AS (
  SELECT COUNT(*)::bigint AS pending_count
  FROM goods_requests
  WHERE status = 'PENDING' AND cancelled = false
),
active_resellers_count AS (
  SELECT COUNT(DISTINCT u.id)::bigint AS reseller_count
  FROM users u
  WHERE u.role = 'staff' AND u.deleted = false
    AND EXISTS (SELECT 1 FROM reseller_stock rs WHERE rs.reseller_id = u.id)
),
recent_activities AS (
  SELECT *
  FROM activities
  ORDER BY created_at DESC
  LIMIT 5
),
stock_alerts AS (
  SELECT 
    p.id,
    p.name AS product_name,
    cs.quantity,
    p.low_stock_threshold,
    CASE 
      WHEN cs.quantity = 0 THEN 'OUT_OF_STOCK'
      ELSE 'LOW_STOCK'
    END AS alert_type
  FROM products p
  JOIN company_stock cs ON cs.product_id = p.id
  WHERE p.deleted = false 
    AND cs.quantity <= p.low_stock_threshold
  ORDER BY cs.quantity ASC, p.name
),
top_resellers AS (
  SELECT 
    u.id,
    u.name,
    ra.total_sales_value,
    COALESCE((SELECT SUM(rbi.remaining_quantity * rbi.unit_cost) 
              FROM reseller_batch_inventory rbi 
              WHERE rbi.reseller_id = u.id), 0)::numeric AS stock_value,
    COALESCE((SELECT SUM(rs.quantity) FROM reseller_stock rs WHERE rs.reseller_id = u.id), 0)::bigint AS current_units,
    ra.total_stock_received AS total_units_received,
    CASE 
      WHEN ra.total_stock_received > 0 THEN 
        GREATEST(0, LEAST(
          ((ra.total_stock_received - COALESCE((SELECT SUM(rs.quantity) FROM reseller_stock rs WHERE rs.reseller_id = u.id), 0)) 
            / ra.total_stock_received * 100)::integer,
          100
        ))
      ELSE 0
    END AS performance
  FROM users u
  JOIN reseller_accounts ra ON ra.reseller_id = u.id
  WHERE u.role = 'staff' AND u.deleted = false
  ORDER BY ra.total_sales_value DESC
  LIMIT 4
)
SELECT 
  json_build_object(
    'total_company_stock', (SELECT total_stock FROM company_stock_total),
    'stock_distributed_units', (SELECT units FROM distribution_units),
    'total_value_distributed', (SELECT value FROM distribution_value),
    'payment_received', (SELECT total FROM payments_received),
    'company_low_stock', (SELECT low_stock_count FROM low_stock_products),
    'total_pending_requests', (SELECT pending_count FROM pending_requests),
    'active_resellers', (SELECT reseller_count FROM active_resellers_count),
    'recent_activities', (SELECT COALESCE(json_agg(row_to_json(recent_activities)), '[]'::json) FROM recent_activities),
    'stock_alerts', (SELECT COALESCE(json_agg(row_to_json(stock_alerts)), '[]'::json) FROM stock_alerts),
    'top_resellers', (SELECT COALESCE(json_agg(row_to_json(top_resellers)), '[]'::json) FROM top_resellers)
  ) AS dashboard_stats;

-- name: GetAdminWeeklyStockChart :many
WITH date_series AS (
  SELECT generate_series::date AS day
  FROM generate_series(
    CURRENT_DATE - INTERVAL '6 days',
    CURRENT_DATE,
    INTERVAL '1 day'
  )
),
distributed AS (
  SELECT
    DATE(date_distributed)::date AS day,
    COALESCE(SUM(quantity), 0)::bigint AS units_distributed
  FROM stock_distributions
  WHERE date_distributed >= CURRENT_DATE - INTERVAL '6 days'
  GROUP BY DATE(date_distributed)
),
current_in_stock AS (
  SELECT COALESCE(SUM(quantity), 0)::bigint AS current_units
  FROM company_stock
),
future_distributions AS (
  -- cumulative distributions after a given day (to reconstruct past stock)
  SELECT ds.day,
         COALESCE((
           SELECT SUM(quantity)
           FROM stock_distributions sd
           WHERE DATE(sd.date_distributed) > ds.day
         ), 0)::bigint AS future_units
  FROM date_series ds
)
SELECT 
  to_char(ds.day, 'Dy') AS date,
  -- Reconstruct end-of-day stock: current stock + distributions that happened AFTER this day
  (SELECT current_units FROM current_in_stock) + fd.future_units AS in_stock,
  COALESCE(d.units_distributed, 0) AS distributed
FROM date_series ds
LEFT JOIN distributed d ON d.day = ds.day
LEFT JOIN future_distributions fd ON fd.day = ds.day
ORDER BY ds.day;
