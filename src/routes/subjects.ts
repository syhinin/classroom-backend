import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";

import { departments, subjects } from "../db/schema";
import { db } from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, pageSize = 10 } = req.query;

    const MAX_PAGE_SIZE = 100;

    const parsedPage = parseInt(String(page), 10);
    const parsedPageSize = parseInt(String(pageSize), 10);
    const currentPage = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
    const limitPerPage = Number.isFinite(parsedPageSize)
      ? Math.min(MAX_PAGE_SIZE, Math.max(1, parsedPageSize))
      : 10;

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    //If search query is provided, filter by subject name or subject code
    if (typeof search === "string" && search.length > 0) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    // If department filter is provided, filter by department name
    if (typeof department === "string" && department.length > 0) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    // Combine filters with AND logic if any exist, otherwise select all subjects
    const whereCondition =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<string>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereCondition);

    const totalCount = Number(countResult[0]?.count ?? 0);

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

    // Normalize the result to handle department: null instead of department: {id: null, name: null, createdAt: null, … }
    const normalizedResult = subjectsResult.map((row) => ({
      ...row,
      department: row.department?.id != null ? row.department : null,
    }));

    res.status(200).json({ 
      data: normalizedResult, 
      pagination: { 
        page: currentPage, 
        limit: limitPerPage, 
        total: totalCount, 
        totalPages: Math.ceil(totalCount / limitPerPage)
      }
    });

  } catch (error) {
    console.error("GET /subjects route:", error);
    res.status(500).json({ error: "Failed to get subjects" });
  }
});

export default router;
