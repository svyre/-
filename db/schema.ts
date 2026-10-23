import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const gameRooms = sqliteTable('game_rooms', {
  code: text('code').primaryKey(),
  hostHash: text('host_hash').notNull(),
  data: text('data').notNull(),
  version: integer('version').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  expiresAt: integer('expires_at').notNull(),
});
