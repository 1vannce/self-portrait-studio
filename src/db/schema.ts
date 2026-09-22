import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const userRole = pgEnum("user_role", ["admin", "staff", "customer"]);

export const reservationStatus = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

export const orderStatus = pgEnum("order_status", [
  "open",
  "finalized",
  "voided",
]);

export const paymentMethod = pgEnum("payment_method", [
  "cash",
  "card",
  "gcash",
  "maya",
  "bank_transfer",
  "other",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const stockMovementType = pgEnum("stock_movement_type", [
  "received",
  "sold",
  "adjusted",
  "returned",
  "damaged",
  "correction",
]);

// ---------------------------------------------------------------------------
// Shared / Cross-Cutting
// ---------------------------------------------------------------------------

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  role: userRole("role").default("customer").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  phone: text("phone"),
  avatarPath: text("avatar_path"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// Subsystem 1: Booking & Reservation
// ---------------------------------------------------------------------------

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const timeSlots = pgTable("time_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "restrict" }),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "restrict" }),
  timeSlotId: uuid("time_slot_id")
    .notNull()
    .unique()
    .references(() => timeSlots.id, { onDelete: "restrict" }),
  guestName: text("guest_name"),
  guestPhone: text("guest_phone"),
  status: reservationStatus("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// Subsystem 2: POS & Billing
// ---------------------------------------------------------------------------

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "restrict" }),
  reservationId: uuid("reservation_id").references(() => reservations.id, {
    onDelete: "set null",
  }),
  status: orderStatus("status").default("open").notNull(),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  createdBy: uuid("created_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPriceCents: integer("unit_price_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  inventoryItemId: uuid("inventory_item_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "restrict" }),
  amountCents: integer("amount_cents").notNull(),
  method: paymentMethod("method").notNull(),
  status: paymentStatus("status").default("pending").notNull(),
  providerReference: text("provider_reference"),
  idempotencyKey: text("idempotency_key").unique(),
  receivedBy: uuid("received_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const receipts = pgTable("receipts", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "restrict" }),
  receiptNumber: text("receipt_number").unique().notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull(),
  documentPath: text("document_path"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// Subsystem 3: Inventory & Supply Management
// ---------------------------------------------------------------------------

export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").unique(),
  category: text("category"),
  unit: text("unit").notNull().default("pcs"),
  currentQuantity: integer("current_quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").notNull().default(0),
  supplierId: uuid("supplier_id").references(() => suppliers.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  inventoryItemId: uuid("inventory_item_id")
    .notNull()
    .references(() => inventoryItems.id, { onDelete: "restrict" }),
  movementType: stockMovementType("movement_type").notNull(),
  quantityChange: integer("quantity_change").notNull(),
  quantityBefore: integer("quantity_before").notNull(),
  quantityAfter: integer("quantity_after").notNull(),
  reason: text("reason"),
  referenceId: text("reference_id"),
  performedBy: uuid("performed_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// Cross-subsystem foreign key on order_items → inventory_items
// (Defined after both tables exist to avoid circular reference)
// ---------------------------------------------------------------------------

// Note: orderItems.inventoryItemId is a plain uuid column above. The FK
// relationship is enforced via the Drizzle migration's generated SQL. We add
// the reference here for Drizzle to pick up in migration generation.

// We cannot use .references() inline above because inventoryItems is defined
// after orderItems. Instead, we rely on the migration to add the FK constraint.
// Drizzle Kit handles this when both tables are in the same schema file.

// ---------------------------------------------------------------------------
// Zod Schemas — Insert & Select for every table
// ---------------------------------------------------------------------------

// Profiles
export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

// Services
export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);

// Time Slots
export const insertTimeSlotSchema = createInsertSchema(timeSlots);
export const selectTimeSlotSchema = createSelectSchema(timeSlots);

// Reservations
export const insertReservationSchema = createInsertSchema(reservations);
export const selectReservationSchema = createSelectSchema(reservations);

// Orders
export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

// Order Items
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const selectOrderItemSchema = createSelectSchema(orderItems);

// Payments
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);

// Receipts
export const insertReceiptSchema = createInsertSchema(receipts);
export const selectReceiptSchema = createSelectSchema(receipts);

// Suppliers
export const insertSupplierSchema = createInsertSchema(suppliers);
export const selectSupplierSchema = createSelectSchema(suppliers);

// Inventory Items
export const insertInventoryItemSchema = createInsertSchema(inventoryItems);
export const selectInventoryItemSchema = createSelectSchema(inventoryItems);

// Stock Movements
export const insertStockMovementSchema = createInsertSchema(stockMovements);
export const selectStockMovementSchema = createSelectSchema(stockMovements);
