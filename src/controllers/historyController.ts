import { eq, inArray } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { history, user } from "../drizzle/schema";
import { AuthenticatedRequest } from "../types/token";
import { geolocationDataSchema, uuidArraySchema, uuidSchema } from "../schema";

export async function createHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const { geolocationData } = req.body;

    const userId = req.user?.id;

    if (!userId || !geolocationData) {
      return res.status(400).send({
        message: "Missing required fields: userId, or geolocationData",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const isValidGeolocationData =
      geolocationDataSchema.safeParse(geolocationData);

    if (isValidGeolocationData.error) {
      return res.status(400).send({
        message: "Invalid geolocationData format",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const [createdHistory] = await db.insert(history).values({
      userId: userId,
      geolocationData: isValidGeolocationData.data,
    });

    return res.status(200).send({
      message: "History saved successfully",
      data: createdHistory,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while creating history. Please try again.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function deleteHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const { ids } = req.body;

    const userId = req.user?.id;

    if (!userId || !ids) {
      return res.status(400).send({
        message: "Missing required fields: userId, or ids",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const isValidIDsArray = uuidArraySchema.safeParse(ids);

    if (isValidIDsArray.error) {
      return res.status(400).send({
        message: "Invalid ids format",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const [createdHistory] = await db
      .delete(history)
      .where(inArray(history.id, isValidIDsArray.data));

    return res.status(200).send({
      message: "History deleted successfully",
      data: createdHistory,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while deleting history. Please try again.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function getHistories(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({
        message: "User not authenticated",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const userHistories = await db
      .select()
      .from(history)
      .where(eq(history.userId, userId));

    return res.status(200).send({
      message: "Histories retrieved successfully",
      data: userHistories,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while retrieving histories. Please try again.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const { historyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({
        message: "User not authenticated",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const isValidHistoryId = uuidSchema.safeParse(historyId);

    if (isValidHistoryId.error) {
      return res.status(400).send({
        message: "Invalid historyId",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const [historyRecord] = await db
      .select()
      .from(history)
      .where(eq(history.id, isValidHistoryId.data));

    if (!historyRecord) {
      return res.status(404).send({
        message: "History not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    if (historyRecord.userId !== userId) {
      return res.status(403).send({
        message: "Access denied. This history does not belong to you.",
        error: "Forbidden",
        statusCode: 403,
      });
    }

    return res.status(200).send({
      message: "History retrieved successfully",
      data: historyRecord,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        "An unexpected error occurred while retrieving history. Please try again.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}
