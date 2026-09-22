-- Custom migration: set_updated_at trigger function
-- Automatically sets updated_at = now() on every UPDATE for tables that have
-- an updated_at column. Attach this trigger to each mutable domain table.

-- Reusable trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Services
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Time Slots
CREATE TRIGGER set_time_slots_updated_at
  BEFORE UPDATE ON time_slots
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Reservations
CREATE TRIGGER set_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Orders
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Payments
CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Suppliers
CREATE TRIGGER set_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Inventory Items
CREATE TRIGGER set_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Note: The following tables are IMMUTABLE and do NOT get this trigger:
--   - order_items (append-only line items)
--   - receipts (immutable financial records)
--   - stock_movements (immutable audit trail)
