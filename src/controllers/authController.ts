import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { user } from "../drizzle/schema";
import { generateToken } from "../lib/token";

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Missing required fields: email, or password",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!existingUser) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid password",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    return res.status(200).send({
      message: "Login successful",
      data: {
        token,
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
      },
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred during signin. Please try again",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function signUp(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const saltRounds = 10;

    if (!email || !password) {
      return res.status(400).send({
        message: "Missing required fields: to_email, to_name, token, or url",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (existingUser) {
      return res.status(409).send({
        message: "User already exists",
        error: "Conflict",
        statusCode: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [createdUser] = await db
      .insert(user)
      .values({
        email: email,
        password: hashedPassword,
      })
      .returning();

    return res.status(200).send({
      message: "Signup successful",
      data: {
        user: {
          id: createdUser.id,
          email: createdUser.email,
        },
      },
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred during signup. Please try again",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
