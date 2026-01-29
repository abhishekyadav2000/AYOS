export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // For now, just return success with file info
    // In a real app, you'd upload to cloud storage (S3, Vercel Blob, etc.)
    const originalName = file.name;
    const fileType = originalName.split(".").pop() || "file";

    return Response.json({
      success: true,
      fileName: originalName,
      originalName: originalName,
      url: `/uploads/${originalName}`,
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
