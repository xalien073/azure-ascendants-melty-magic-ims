// api/saveMetaData

import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import { NextResponse } from "next/server";

const TABLE_ACCOUNT_NAME = "vipernest";
const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Only the Account Key
const TABLE_NAME = "MicroserviceAzureAscendants";

// Initialize Azure Table Storage Client
const credential = new AzureNamedKeyCredential(
  TABLE_ACCOUNT_NAME, // Account Name
  TABLE_ACCOUNT_KEY   // Account Key only
);

const tableClient = new TableClient(
  `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`, // Table Storage endpoint
  TABLE_NAME,
  credential
);

export const POST = async (req) => {
  try {
    // Parse JSON request body
    const { name, brand, price, quantityAvailable, blobUrl } = await req.json();

    // Validate required fields
    if (!name || !brand || !price || !quantityAvailable || !blobUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Define entity to store in Table Storage
    const entity = {
      partitionKey: "chocolates", // Static partition key
      rowKey: name, // Unique identifier
      brand,
      price: parseFloat(price),
      quantityAvailable: parseInt(quantityAvailable, 10),
      imageUrl: blobUrl, // URL from uploaded image
    };

    // Create entity in Azure Table Storage
    await tableClient.createEntity(entity);

    return NextResponse.json(
      { message: "Metadata saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving metadata:", error);
    return NextResponse.json(
      { message: "Failed to save metadata" },
      { status: 500 }
    );
  }
};
