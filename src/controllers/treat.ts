import { Request, Response } from "express";
import { pool } from "../db";
import { USER_ROLE } from "../constants";

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

export const updateTreat = async (request: Request, response: Response) => {
  try {
  } catch (error) {}
};

export const deleteTreat = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        message: "Id is required",
      });
    }

    const { user } = request.locals;

    const getTreatQuery = `
      SELECT t.id, u.id as user_id FROM treat t
      JOIN "user" u ON t.user_id = u.id
      WHERE t.id = $1 AND u.is_active = true
    `;

    const getTreatQueryRes = await pool.query(getTreatQuery, [id]);

    const treat = getTreatQueryRes?.rows[0];

    if (!treat) {
      return response.status(400).json({
        message: "Treat not found with the provided id",
      });
    }

    if (treat.user_id !== user.id && user.role !== USER_ROLE.Admin) {
      return response.status(400).json({
        message: "You are not authorized to delete this treat",
      });
    }

    await pool.query(`DELETE * FROM treat WHERE id = $1`, [id]);

    response.status(200).json({
      message: "Treat has been deleted successfully",
    });
  } catch (error: any) {
    response.status(500).json({
      message: error?.message || "Something went wrong deleting the treat",
    });
  }
};
