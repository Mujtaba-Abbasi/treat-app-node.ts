import { Lucia } from "lucia";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { pool } from "./db";
// import { webcrypto } from "crypto";
// globalThis.crypto = webcrypto as Crypto;

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
  getUserAttributes: (attributes) => {
    const user: { username?: string; role?: string } = {
      ...attributes,
    };
    return {
      username: user.username,
      role: user.role,
    };
  },
});

declare global {
  namespace Lucia {
    type Auth = typeof lucia;
    type DatabaseUserAttributes = {
      username: string;
      role: string;
    };
    type DatabaseSessionAttributes = {};
  }
}
