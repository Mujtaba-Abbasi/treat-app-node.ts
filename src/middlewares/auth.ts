import { NextFunction, Request, Response } from "express";
import { lucia } from "../lucia.config";

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const cookie = request.headers.cookie;

    if (!cookie) {
      return response.status(401).json({
        message: "You are not authorized to make this request",
      });
    }

    const sessionId = cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("auth_session="))
      ?.split("=")?.[1];

    if (!sessionId) {
      return response.status(401).json({
        message: "Invalid session",
      });
    }

    const validationRes = await lucia.validateSession(sessionId);

    if (!validationRes.session || !validationRes.user) {
      await lucia.invalidateSession(sessionId);
      return response.status(401).json({
        message: "You are not authorized to make this request",
      });
    }

    request.locals = {
      ...validationRes,
    };

    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    response.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};
