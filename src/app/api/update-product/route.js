// api/update-product/route.js

import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

export async function POST(req) {
  const TABLE_ACCOUNT_NAME = "vipernest";
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Account Key only
  const TABLE_NAME = "azureAscendantsMeltyMagicInventory";

  try {
    // Parse the request body
    const body = await req.json();
    const { name, price, quantityAvailable } = body;

    if (!name || price === undefined || quantityAvailable === undefined) {
      return new Response(JSON.stringify({ error: "Invalid input data" }), { status: 400 });
    }

    // Initialize Azure Table Storage Client
    const credential = new AzureNamedKeyCredential(TABLE_ACCOUNT_NAME, TABLE_ACCOUNT_KEY);
    const tableClient = new TableClient(
      `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
      TABLE_NAME,
      credential
    );

    // Fetch the entity by name (unique)
    const entitiesIterator = tableClient.listEntities({ filter: `name eq '${name}'` });
    const firstEntity = (await entitiesIterator.next()).value;

    if (!firstEntity) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    // Update the entity with new values
    const updatedEntity = {
      ...firstEntity,
      price, // Update price
      quantityAvailable, // Update quantity
    };

    // Update the entity in the table
    await tableClient.updateEntity(updatedEntity, "Merge");

    return new Response(JSON.stringify({ success: true, message: "Product updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(JSON.stringify({ error: "Failed to update product" }), { status: 500 });
  }
}



// // api/update-product/route.js

// import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

// export async function POST(req) {
//   const TABLE_ACCOUNT_NAME = "vipernest";
//   const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Account Key only
//   const TABLE_NAME = "azureAscendantsMeltyMagicInventory";

//   try {
//     // Parse the request body
//     const body = await req.json();
//     const { name, price, quantityAvailable } = body;
//     console.log(name, price, quantityAvailable);

//     if (!name || price === undefined || quantityAvailable === undefined) {
//       return new Response(JSON.stringify({ error: "Invalid input data" }), { status: 400 });
//     }

//     // Initialize Azure Table Storage Client
//     const credential = new AzureNamedKeyCredential(TABLE_ACCOUNT_NAME, TABLE_ACCOUNT_KEY);
//     const tableClient = new TableClient(
//       `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
//       TABLE_NAME,
//       credential
//     );

//     // Fetch the entity by name
//     const entity = [...(await tableClient.listEntities({ filter: `name eq '${name}'` }))][0];

//     if (!entity) {
//       return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
//     }

//     // Update the entity with new values
//     const updatedEntity = {
//       ...entity,
//       price, // Update price
//       quantityAvailable, // Update quantity
//     };

//     // Update the entity in the table
//     await tableClient.updateEntity(updatedEntity, "Merge");

//     return new Response(JSON.stringify({ success: true, message: "Product updated successfully" }), { status: 200 });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return new Response(JSON.stringify({ error: "Failed to update product" }), { status: 500 });
//   }
// }
