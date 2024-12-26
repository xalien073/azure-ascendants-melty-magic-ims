// api/uploadImage

import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "azure-ascendants-melty-magic-images";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    // Convert file to ArrayBuffer for upload
    const buffer = await file.arrayBuffer();

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

    const blobName = `${uuidv4()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload file as a buffer
    await blockBlobClient.uploadData(Buffer.from(buffer), {
      blobHTTPHeaders: { blobContentType: file.type || "application/octet-stream" },
    });

    return NextResponse.json({
      message: "Image uploaded successfully",
      blobUrl: blockBlobClient.url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
  }
};
