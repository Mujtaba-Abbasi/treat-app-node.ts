import { Lucia } from "lucia";
import { hash } from "bcrypt";
import { pool } from "../db/index.js";

export const createUser = async (request, response) => {
  try {
    const { first_name, last_name, email, username, password } = request.body;

    console.log("The input vars =>", request.body);

    if (!first_name || !last_name || !email || !username || !password) {
      return response.status(400).json({
        message: "Missing fields",
        data: null,
      });
    }

    const hashed_password = await hash(password, 10); // Reduced cost factor

    const query = `
        INSERT INTO "user" (first_name, last_name, email, username, hashed_password)
        VALUES($1, $2, $3, $4, $5)
        RETURNING user_id, username, role
        `;

    const values = [first_name, last_name, email, username, hashed_password];

    const result = await pool.query(query, values);

    const user = result.rows[0];
    const user_id = user.user_id;
    const role = user.role;

    // Assuming you've set up Lucia correctly
    const session = await Lucia.createSession(user_id, { role });

    response.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    response.status(400).json({
      message: error?.message || "Something went wrong creating the user",
      data: null,
    });
  }
};
