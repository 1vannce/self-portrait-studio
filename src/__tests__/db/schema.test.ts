import { describe, expect, it } from "vitest";
import {
  // Enums
  userRole,
  reservationStatus,
  orderStatus,
  paymentMethod,
  paymentStatus,
  stockMovementType,
  // Zod insert schemas
  insertProfileSchema,
  insertServiceSchema,
  insertTimeSlotSchema,
  insertReservationSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertPaymentSchema,
  insertReceiptSchema,
  insertSupplierSchema,
  insertInventoryItemSchema,
  insertStockMovementSchema,
} from "@/db/schema";

// ---------------------------------------------------------------------------
// Enum validation
// ---------------------------------------------------------------------------

describe("Enum definitions", () => {
  it("userRole has the expected values", () => {
    expect(userRole.enumValues).toEqual(["admin", "staff", "customer"]);
  });

  it("reservationStatus has the expected values", () => {
    expect(reservationStatus.enumValues).toEqual([
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "no_show",
    ]);
  });

  it("orderStatus has the expected values", () => {
    expect(orderStatus.enumValues).toEqual(["open", "finalized", "voided"]);
  });

  it("paymentMethod has the expected values", () => {
    expect(paymentMethod.enumValues).toEqual([
      "cash",
      "card",
      "gcash",
      "maya",
      "bank_transfer",
      "other",
    ]);
  });

  it("paymentStatus has the expected values", () => {
    expect(paymentStatus.enumValues).toEqual([
      "pending",
      "completed",
      "failed",
      "refunded",
    ]);
  });

  it("stockMovementType has the expected values", () => {
    expect(stockMovementType.enumValues).toEqual([
      "received",
      "sold",
      "adjusted",
      "returned",
      "damaged",
      "correction",
    ]);
  });
});

// ---------------------------------------------------------------------------
// Zod insert schema validation
// ---------------------------------------------------------------------------

describe("Insert schemas — valid input", () => {
  it("insertProfileSchema accepts a valid profile", () => {
    const result = insertProfileSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      role: "customer",
      displayName: "Juan dela Cruz",
      email: "juan@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("insertServiceSchema accepts a valid service", () => {
    const result = insertServiceSchema.safeParse({
      name: "Solo Portrait 30min",
      durationMinutes: 30,
      priceCents: 50000,
    });
    expect(result.success).toBe(true);
  });

  it("insertTimeSlotSchema accepts a valid time slot", () => {
    const result = insertTimeSlotSchema.safeParse({
      date: "2026-10-15",
      startTime: "09:00:00",
      endTime: "09:30:00",
    });
    expect(result.success).toBe(true);
  });

  it("insertReservationSchema accepts a valid reservation", () => {
    const result = insertReservationSchema.safeParse({
      profileId: "550e8400-e29b-41d4-a716-446655440000",
      serviceId: "550e8400-e29b-41d4-a716-446655440001",
      timeSlotId: "550e8400-e29b-41d4-a716-446655440002",
      status: "pending",
    });
    expect(result.success).toBe(true);
  });

  it("insertOrderSchema accepts a valid order", () => {
    const result = insertOrderSchema.safeParse({
      profileId: "550e8400-e29b-41d4-a716-446655440000",
      status: "open",
    });
    expect(result.success).toBe(true);
  });

  it("insertOrderItemSchema accepts a valid order item", () => {
    const result = insertOrderItemSchema.safeParse({
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      description: "Photo print 4x6",
      quantity: 2,
      unitPriceCents: 5000,
      totalCents: 10000,
    });
    expect(result.success).toBe(true);
  });

  it("insertPaymentSchema accepts a valid payment", () => {
    const result = insertPaymentSchema.safeParse({
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      amountCents: 50000,
      method: "gcash",
    });
    expect(result.success).toBe(true);
  });

  it("insertReceiptSchema accepts a valid receipt", () => {
    const result = insertReceiptSchema.safeParse({
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      receiptNumber: "RCP-2026-0001",
      issuedAt: new Date(),
    });
    expect(result.success).toBe(true);
  });

  it("insertSupplierSchema accepts a valid supplier", () => {
    const result = insertSupplierSchema.safeParse({
      name: "Photo Supplies Co.",
    });
    expect(result.success).toBe(true);
  });

  it("insertInventoryItemSchema accepts a valid inventory item", () => {
    const result = insertInventoryItemSchema.safeParse({
      name: "Photo paper A4",
      sku: "PP-A4-001",
      unit: "pcs",
    });
    expect(result.success).toBe(true);
  });

  it("insertStockMovementSchema accepts a valid stock movement", () => {
    const result = insertStockMovementSchema.safeParse({
      inventoryItemId: "550e8400-e29b-41d4-a716-446655440000",
      movementType: "received",
      quantityChange: 100,
      quantityBefore: 0,
      quantityAfter: 100,
      reason: "Initial stock",
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Zod insert schema rejection
// ---------------------------------------------------------------------------

describe("Insert schemas — invalid input", () => {
  it("insertProfileSchema rejects an invalid role", () => {
    const result = insertProfileSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      role: "superadmin",
    });
    expect(result.success).toBe(false);
  });

  it("insertServiceSchema rejects missing required fields", () => {
    const result = insertServiceSchema.safeParse({
      description: "Missing name and price",
    });
    expect(result.success).toBe(false);
  });

  it("insertPaymentSchema rejects invalid payment method", () => {
    const result = insertPaymentSchema.safeParse({
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      amountCents: 50000,
      method: "bitcoin",
    });
    expect(result.success).toBe(false);
  });

  it("insertReservationSchema rejects invalid status", () => {
    const result = insertReservationSchema.safeParse({
      profileId: "550e8400-e29b-41d4-a716-446655440000",
      serviceId: "550e8400-e29b-41d4-a716-446655440001",
      timeSlotId: "550e8400-e29b-41d4-a716-446655440002",
      status: "approved",
    });
    expect(result.success).toBe(false);
  });

  it("insertStockMovementSchema rejects invalid movement type", () => {
    const result = insertStockMovementSchema.safeParse({
      inventoryItemId: "550e8400-e29b-41d4-a716-446655440000",
      movementType: "stolen",
      quantityChange: -5,
      quantityBefore: 10,
      quantityAfter: 5,
    });
    expect(result.success).toBe(false);
  });
});
