import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "documents";

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type for resume folder
    if (folder === "documents") {
      const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
      if (!allowedTypes.includes(file.type)) {
        return Response.json(
          { error: "Invalid file type. Allowed: PDF, DOCX, TXT" },
          { status: 400 }
        );
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", folder);
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Get file extension
    const originalName = file.name;
    const fileExtension = originalName.split(".").pop() || "file";
    const safeFileName = originalName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .substring(0, 100);

    const filePath = join(uploadsDir, safeFileName);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Return public URL
    const publicUrl = `/uploads/${folder}/${safeFileName}`;

    return Response.json({
      success: true,
      fileName: safeFileName,
      originalName: originalName,
      url: publicUrl,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("[Upload API] Error:", error);
    return Response.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
