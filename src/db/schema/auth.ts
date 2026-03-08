import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  boolean,
  pgEnum,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const rolesEnum = pgEnum("roles", ["student", "teacher", "admin"]);

//AUTH Module Schemas

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), //User's chosen display name
  email: text("email").notNull().unique(), //User's email address for communication and login
  emailVerified: boolean("email_verified").default(false).notNull(), //Whether the user's email is verified
  image: text("image"), //User's image url
  role: rolesEnum("role").default("student").notNull(),
  imageCldPubId: text("image_cld_pub_id"),

  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(), //The unique session token
    expiredAt: timestamp("expired_at").notNull(),
    ipAddress: text("ip_address"), //The IP address of the device
    userAgent: text("user_agent"), //The user agent information of the device

    ...timestamps,

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(), //The ID of the account as provided by the SSO or equal to userId for credential accounts
    providerId: text("provider_id").notNull(), //The ID of the provider
    accessToken: text("access_token"), //The access token of the account. Returned by the provider
    refreshToken: text("refresh_token"), //The refresh token of the account. Returned by the provider
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"), //The scope of the account. Returned by the provider
    idToken: text("id_token"), //The ID token returned from the provider
    password: text("password"), // The One-way password hash only. Mainly used for email and password authentication

    ...timestamps,

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(), //The identifier for the verification request
    value: text("value").notNull(), //The value to be verified
    expiresAt: timestamp("expires_at").notNull(), //The time when the verification request expires

    ...timestamps,
  },
  (table) => [index("verification_user_id_idx").on(table.identifier)],
);

//AUTH Module relations

export const userRelation = relations(user, ({ many }) => ({
  session: many(session),
  account: many(account),
}));

export const sessionRelation = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelation = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

//AUTH Module types

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
