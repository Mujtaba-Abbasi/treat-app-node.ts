import { Request, Response } from "express";
import { pool } from "../db";
import { USER_ROLE } from "../constants";
import { UpdateTreatSchemaType } from "../utils/types";

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

export const getAllTreats = async (request: Request, response: Response) => {
  try {
    const { user } = request.locals;
    const { id } = request.params;

    const userId = id ?? user.id;

    const userExists = await pool.query(`SELECT id FROM "user" WHERE id = $1`, [
      userId,
    ]);

    if (!userExists.rows[0]) {
      return response.status(400).json({
        message: "User not found",
      });
    }

    const getAllTreatsQuery = `
      SELECT t.id, t.title, t.description, t.user_id AS "userId", t.created_at AS "createdAt", t.is_fulfilled AS "isFulfilled", t.fulfilled_on AS "fulfilledOn"
      FROM treat t
      LEFT JOIN "user" u ON t.user_id = u.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `;

    const getAllTreatsRes = await pool.query(getAllTreatsQuery, [userId]);

    const userTreats = getAllTreatsRes.rows;

    response.status(200).json({
      message: "Successfully fetched the user treats",
      data: userTreats,
    });
  } catch (error: any) {
    response.status(400).json({
      message: error?.message || "Something went wrong fetching user's treats",
    });
  }
};

export const updateTreat = async (request: Request, response: Response) => {
  try {
    const { user } = request.locals;
    const { id, title, description }: UpdateTreatSchemaType = request.body;

    const fetchQuery = `
        SELECT id, user_id as "userId"
        FROM treat
        WHERE id = $1
    `;

    const fetchQueryRes = await pool.query(fetchQuery, [id]);
    const treat = fetchQueryRes.rows[0];

    if (!treat) {
      return response.status(400).json({
        message: "Treat not found with the provided id",
      });
    }

    if (treat.userId !== user.id && user.role !== USER_ROLE.Admin) {
      return response.status(400).json({
        message: "You are not authorized to edit this treat",
      });
    }

    const updateQuery = `
      UPDATE treat
      SET title = $1, description = $2
      WHERE id = $3
      RETURNING Id, title, description
    `;

    const updateQueryRes = await pool.query(updateQuery, [
      title,
      description,
      id,
    ]);

    response.status(200).json({
      message: "Treat has been updated successfully",
      data: updateQueryRes.rows[0],
    });
  } catch (error: any) {
    console.log("The error in updating treat =>", error);
    response.status(400).json({
      message: error?.message || "Something went wrong updating the treat",
    });
  }
};
