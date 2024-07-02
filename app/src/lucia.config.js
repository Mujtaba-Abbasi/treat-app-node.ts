import { Lucia } from "lucia";
import { v4 as uuidv4 } from "uuid";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { pool } from "./db/index.js";
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto;

const adapter = new NodePostgresAdapter(pool, {
  user: "user",
  session: "user_session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  setSessionIdGenerator: {
    uuidv4,
  },

  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      role: attributes.role,
    };
  },
});
