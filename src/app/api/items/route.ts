import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";
import { NextResponse } from "next/server";
import { Item } from "@/utils/helper/types/Items";
import { naturalSort } from "@/utils/helper/naturalSort";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const sortField = searchParams.get("sortField") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const filePath: string = path.join(
    process.cwd(),
    "./src/utils/helper/data/data.csv"
  );

  const fileContent: string = fs.readFileSync(filePath, "utf8");

  try {
    const records: Item[] = parse(fileContent, {
      columns: ["createdAt", "filename"],
      delimiter: ";"
    });

    // Sorting logic based on query parameters
    const sortedRecords = records.sort((a, b) => {
      if (sortField === "created_at") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === "filename") {
        return sortOrder === "asc"
          ? naturalSort(a.filename, b.filename)
          : naturalSort(b.filename, a.filename);
      }
      return 0;
    });

    const start = (page - 1) * pageSize;
    const paginatedRecords = sortedRecords.slice(start, start + pageSize);

    return NextResponse.json({
      data: paginatedRecords,
      total: sortedRecords.length,
      page,
      pageSize
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching items" },
      { status: 500 }
    );
  }
}
