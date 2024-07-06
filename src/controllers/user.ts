import { Request, Response } from "express";
import { pool } from "../db";

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
  } catch (error: any) {
    console.log(`There is an error`, error?.message);
    response.status(400).json({
      message:
        error?.message || "Something went wrong fetching the user record",
    });
  }
};
