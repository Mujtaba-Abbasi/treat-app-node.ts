import { lucia } from "../lucia.config";

export const auth = async (request, response, next) => {
  try {
    const cookie = request.headers.cookie;

    if (!cookie) {
      return response.status(401).json({
        message: "You are not authorized to make this request",
      });
    }

    const sessionId = cookie.split("=")[1];

    const validationRes = await lucia.validateSession(sessionId);

    if (!validationRes.session || !validationRes.user) {
      return response.status(401).json({
        message: "You are not authorized to make this request",
      });
    }

    request.locals = {
      ...validationRes,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    response.status(500).json({
      message: "Internal Server Error",
    });
  }
};
