ALTER TABLE "images" DROP CONSTRAINT "images_uploader_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "downloads_left" integer;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "expiration_time" timestamp;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "password" varchar(64);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_uploader_id_user_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
