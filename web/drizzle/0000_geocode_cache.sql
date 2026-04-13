CREATE TABLE "geocode_cache" (
	"cache_key" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"payload" jsonb NOT NULL,
	"payload_version" integer DEFAULT 1 NOT NULL
);
