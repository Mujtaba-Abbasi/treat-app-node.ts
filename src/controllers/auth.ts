import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { pool } from "../db";
import { createSession } from "../utils/createSession";
import { lucia } from "../lucia.config";

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
      response.cookie("auth_session", session.id, session.payload);
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

export const logout = async (request: Request, response: Response) => {
  try {
    const { session } = request.locals;

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    response.cookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    response.status(200).json({
      message: "Logout successful",
    });
  } catch (error: any) {
    console.log(`The error is in logout =>`, error);
    response.status(400).json({
      message: error?.message || "Something went wrong logging out",
    });
  }
};

export const register = async (request: Request, response: Response) => {
  try {
    const { first_name, last_name, email, username, password } = request.body;

    if (!first_name || !last_name || !email || !username || !password) {
      return response.status(400).json({
        message: "Missing fields",
        data: null,
      });
    }

    const hashed_password = await hash(password, 10);

    const query = `
        INSERT INTO "user" (
         first_name, last_name, email, username, hashed_password)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, username, created_at AS createdAt
        `;

    const values = [first_name, last_name, email, username, hashed_password];

    const result = await pool.query(query, values);

    const user = result.rows[0];

    const session = await createSession(user.id);

    if (session) {
      response.cookie("session", session.id, session.payload);
    }

    response.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Error in createUser:", error);
    response.status(400).json({
      message: error?.message || "Something went wrong creating the user",
      data: null,
    });
  }
};
