ALTER TABLE "departments" DROP CONSTRAINT "departments_core_unique";--> statement-breakpoint
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_core_unique";--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "code" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "code" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" DROP COLUMN "core";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "core";--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_code_unique" UNIQUE("code");