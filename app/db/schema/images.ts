import { integer, pgEnum, pgTable, varchar, timestamp, index } from "drizzle-orm/pg-core";

const ImageTypeEnum = pgEnum("type", [
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/png',
  'image/gif',
  'image/heic',
  'image/ico',
]);

export const images = pgTable("images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  file_name: varchar("name", { length: 255 }).notNull(),
  file_type: ImageTypeEnum().notNull(),
  file_size: integer("size").notNull(),
  upload_date: timestamp("date").defaultNow().notNull(),
  share_link: varchar("link", { length: 255 }).notNull().unique(),
  uploader_ip: varchar("uploader_ip", { length: 50 }),
  uploader_id: integer("uploader_id")
}, (table) => {
  return {
    shareLinkIdx: index("share_link_idx").on(table.file_name),
    uploaderIdIdx: index("uploader_id_idx").on(table.uploader_ip)
  } 
});
