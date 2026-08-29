CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_email` text NOT NULL,
	`customer_name` text,
	`shipping_address` text,
	`status` text DEFAULT 'PENDING',
	`items` text,
	`total` real NOT NULL,
	`stripe_session_id` text,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`country` text,
	`category` text NOT NULL,
	`price_min` real NOT NULL,
	`price_max` real,
	`is_negotiable` integer DEFAULT false,
	`rarity` text DEFAULT 'AVAILABLE',
	`images` text,
	`active` integer DEFAULT true,
	`created_at` integer DEFAULT (unixepoch())
);
