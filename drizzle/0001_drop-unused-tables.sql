DROP TABLE "authenticator" CASCADE;--> statement-breakpoint
DROP TABLE "verificationToken" CASCADE;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "metadata" json DEFAULT '{}'::json;