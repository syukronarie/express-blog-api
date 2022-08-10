CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "username" varchar,
  "password" varchar,
  "email" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "posts" (
  "id" int PRIMARY KEY,
  "author_id" int,
  "categories" varchar,
  "tags" varchar,
  "title" varchar,
  "content" varchar,
  "banner_image" varchar,
  "is_published" boolean,
  "created_at" timestamp,
  "updated_at" timestamp,
  "published_at" timestamp
);

CREATE TABLE "posts_categories" (
  "id" int PRIMARY KEY,
  "title" varchar,
  "description" varchar,
  "slug" varchar,
  "is_published" boolean,
  "created_at" timestamp,
  "updated_at" timestamp,
  "published_at" timestamp
);

CREATE TABLE "posts_tags" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "posts_votes" (
  "id" int PRIMARY KEY,
  "author_id" int,
  "post_id" int
);

CREATE TABLE "posts_comments" (
  "id" int PRIMARY KEY,
  "title" varchar,
  "author_id" int,
  "post_id" int,
  "created_at" timestamp,
  "updated_at" timestamp
);

COMMENT ON COLUMN "users"."created_at" IS 'When post created';

COMMENT ON COLUMN "users"."updated_at" IS 'When post updated';

COMMENT ON COLUMN "posts"."created_at" IS 'When post created';

COMMENT ON COLUMN "posts"."updated_at" IS 'When post updated';

COMMENT ON COLUMN "posts"."published_at" IS 'When post published';

COMMENT ON COLUMN "posts_categories"."created_at" IS 'When post created';

COMMENT ON COLUMN "posts_categories"."updated_at" IS 'When post updated';

COMMENT ON COLUMN "posts_categories"."published_at" IS 'When post published';

COMMENT ON COLUMN "posts_comments"."created_at" IS 'When post created';

COMMENT ON COLUMN "posts_comments"."updated_at" IS 'When post updated';

ALTER TABLE "posts" ADD CONSTRAINT "posts_authors" FOREIGN KEY ("author_id") REFERENCES "users" ("id");

ALTER TABLE "posts_votes" ADD CONSTRAINT "posts_votes" FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "posts_comments" ADD CONSTRAINT "posts_comments" FOREIGN KEY ("post_id") REFERENCES "posts" ("id");
