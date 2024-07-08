import { Request, Response } from "express";
import { pool } from "../db";

export const createTreat = async (request: Request, response: Response) => {
  try {
    const { user } = request.locals || {};
    const { title, description } = request.body;

    const query = `
      INSERT INTO treat 
      (title, description, user_id)
      VALUES($1, $2, $3)
      RETURNING id, title, description, created_at
    `;

    const queryRes = await pool.query(query, [title, description, user.id]);

    const { created_at, ...rest } = queryRes.rows[0];

    response.status(201).json({
      message: "Treat has been created successfully",
      data: {
        ...rest,
        createdAt: created_at,
        userId: user.id,
      },
    });
  } catch (error: any) {
    console.log(`Something went wrong creating the treat =>`, error?.message);
    response.status(400).json({
      message: error?.message || "Internal server error",
    });
  }
};
