import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";

import { departments, subjects } from "../db/schema";
import { db } from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, pageSize = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +pageSize);

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    //If search query is provided, filter by subject name or subject code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    // If department filter is provided, filter by department name
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    // Combine filters with AND logic if any exist, otherwise select all subjects
    const whereCondition =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereCondition);

    const totalCount = countResult[0]?.count ?? 0;

    const subjectsResult = await db.select({
      ...getTableColumns(subjects),
      department: { ...getTableColumns(departments) },
    })
    .from(subjects)
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .where(whereCondition)
    .orderBy(desc(subjects.createdAt))
    .limit(limitPerPage)
    .offset(offset);

    res.status(200).json({ 
      data: subjectsResult, 
      pagination: { 
        page: currentPage, 
        limit: limitPerPage, 
        total: Number(totalCount), 
        totalPages: Math.ceil(Number(totalCount) / limitPerPage)
      }
    });

  } catch (error) {
    console.error("GET /subjects route:", error);
    res.status(500).json({ error: "Failed to get subjects" });
  }
});

export default router;
