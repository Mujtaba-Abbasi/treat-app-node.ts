import { Request, Response } from "express";
import { hash } from "bcrypt";
import { pool } from "../db";
import { createSession } from "../utils/createSession";

export const createUser = async (request: Request, response: Response) => {
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

export const getUserById = async (request: Request, response: Response) => {
  try {
    const { user } = request.locals;
    const { id } = request.params;

    const userId = id ?? user?.id;

    if (!user) {
      throw {
        message: "User id is required to make this API call",
      };
    }

    const query = `
      SELECT * FROM user_view WHERE id = $1
    `;

    const res = await pool.query(query, [userId]);

    if (!res) {
      response.status(400).json({
        message: "User not found with the provided userId",
      });
    }

    const userInfo = res.rows?.[0];

    response.status(200).json({
      message: "User fetched successfully",
      data: userInfo,
    });
  } catch (error) {
    console.log(`There is an error`, error?.message);
    response.status(400).json({
      message:
        error?.message || "Something went wrong fetching the user record",
    });
  }
};
