// api/get-thumbnails/route.js

import { BlobServiceClient } from "@azure/storage-blob";

export async function GET(req) {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = "azure-ascendants-melty-magic-thumbnails";

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const thumbnails = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      const blobURL = `${containerClient.url}/${blob.name}`;
      thumbnails.push(blobURL);
    }

    return new Response(JSON.stringify({ thumbnails }), { status: 200 });
  } catch (error) {
    console.error("Error fetching thumbnails:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch thumbnails" }), { status: 500 });
  }
}
