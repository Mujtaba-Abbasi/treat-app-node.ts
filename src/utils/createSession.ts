import { CookieOptions } from "express";
import { lucia } from "../lucia.config";
import { getUniqueId } from "./uuid4";

export async function createSession(userId: string): Promise<{
  id: string;
  payload: CookieOptions;
} | null> {
  try {
    // userId, attributes, optional options (sessionId)
    const session = await lucia.createSession(
      userId,
      {},
      { sessionId: getUniqueId() }
    );

    return {
      id: session.id,
      payload: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      },
    };
  } catch (error: any) {
    console.log(`Error Creating the session for the user =>`, error?.message);
    return null;
  }
}
