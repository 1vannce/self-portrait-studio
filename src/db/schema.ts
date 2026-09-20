import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const portraitStatus = pgEnum("portrait_status", [
  "draft",
  "processing",
  "ready",
  "failed",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name"),
  avatarPath: text("avatar_path"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const portraits = pgTable("portraits", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  sourcePath: text("source_path").notNull(),
  resultPath: text("result_path"),
  prompt: text("prompt"),
  status: portraitStatus("status").default("draft").notNull(),
  providerJobId: text("provider_job_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export const insertPortraitSchema = createInsertSchema(portraits);
export const selectPortraitSchema = createSelectSchema(portraits);
