import { Request, Response } from "express";
import { pool } from "../db";
import { USER_ROLE } from "../constants";
import moment from "moment";

export const getUserById = async (request: Request, response: Response) => {
  try {
    const { user } = request.locals || {};
    const { id } = request.params;

    const userId = id ?? user?.id;

    if (!user) {
      throw {
        message: "User id is required to make this API call",
      };
    }

    const query = `
      SELECT uv.* FROM user_view uv JOIN "user" u ON uv.id = u.id WHERE u.id = $1
    `;

    const res = await pool.query(query, [userId]);

    if (!res) {
      response.status(400).json({
        message: "User not found with the provided userId",
      });
    }

    const userInfo = res.rows?.[0];

    response.status(200).json({
      message: userInfo
        ? "User fetched successfully"
        : "No user found with the provided userId",
      data: userInfo || null,
    });
  } catch (error: any) {
    console.log(`There is an error fetching the user =>`, error?.message);
    response.status(400).json({
      message:
        error?.message || "Something went wrong fetching the user record",
    });
  }
};

export const deleteUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const user = request?.locals?.user;

    if (!id) {
      response.status(400).json({
        message: "User id is required",
      });
    }

    if (user?.role && user?.role !== USER_ROLE.Admin && user?.id !== id) {
      return response.status(400).json({
        message: "You are not authorized to perform this operation",
      });
    }

    const query = `SELECT id, email, is_active, username FROM "user" WHERE id = $1 AND is_active = true`;

    const queryRes = await pool.query(query, [id]);
    const primaryUser = queryRes.rows[0];

    if (!primaryUser) {
      return response.status(400).json({
        message: "User not found with the provided id",
      });
    }

    if (primaryUser.is_active) {
      const newEmail = `${
        primaryUser.email?.split("@")[0]
      }-${moment().unix()}@${primaryUser.email?.split("@")[1]}`;

      const newUsername = `${primaryUser.username}-${moment().unix()}`;

      const updateUserQuery = `UPDATE "user" SET is_active = false, email = $1, username = $2, deleted_at = CURRENT_TIMESTAMP WHERE id = $3`;

      await pool.query(updateUserQuery, [newEmail, newUsername, id]);
    }

    const sessionQuery = `DELETE FROM user_session where user_id = $1`;

    await pool.query(sessionQuery, [id]);

    response.status(200).json({
      message: "User has been deleted successfully",
    });
  } catch (error: any) {
    console.log(`Something went wrong deleting the user =>`, error?.message);
    response.status(400).json({
      message: error?.message || "Internal server error",
    });
  }
};
