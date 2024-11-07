DROP INDEX IF EXISTS "share_link_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "uploader_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "share_link_idx" ON "images" USING btree ("share_link");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uploader_id_idx" ON "images" USING btree ("uploader_id");