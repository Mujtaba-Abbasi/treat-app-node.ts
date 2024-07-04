import { Request, Response } from "express";
import { compare } from "bcrypt";
import { pool } from "../db";
import { createSession } from "../utils/createSession";

export const login = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    const query = `
      SELECT view.*, hashed_password FROM user_view view JOIN "user" u ON view.email = u.email WHERE view.email = $1 AND u.is_active = true;
    `;

    const queryRes = await pool.query(query, [email]);

    const user = queryRes.rows?.[0];

    if (!user) {
      response.status(400).json({
        message: "User not found with the provided credentials",
      });
    }

    const isPasswordValid = await compare(password, user.hashed_password);

    if (!isPasswordValid) {
      response.status(400).json({
        message: "Invalid credentials. Kindly provide valid credentials",
      });
    }

    const session = await createSession(user.id);

    if (session) {
      response.cookie("session", session.id, session.payload);
    }

    delete user.hashed_password;

    response.status(400).json({
      message: "Login successful",
      data: user,
    });
  } catch (error: any) {
    response.status(400).json({
      message: error?.message || "Something went wrong",
    });
  }
};
