// api/sendEvent

import { EventHubProducerClient } from "@azure/event-hubs";
import { NextResponse } from "next/server";

// Azure Event Hub Configuration
const EVENT_HUB_CONNECTION_STRING = process.env.EVENT_HUB_CONNECTION_STRING;
const EVENT_HUB_NAME = "chocolates";

export async function POST(req) {
  let producer;

  try {
    console.log("Initializing EventHubProducerClient...");
    producer = new EventHubProducerClient(EVENT_HUB_CONNECTION_STRING, EVENT_HUB_NAME);
    console.log("Producer initialized.");

    const body = await req.json();
    console.log(body);
    const events = body || [{ body: "Fallback event!" }];

    console.log("Creating batch...");
    const batch = await producer.createBatch();

    console.log("Adding events to batch...");
    for (const event of events) {
      if (!batch.tryAdd(event)) {
        console.error("Event too large to fit in batch:", event);
        return NextResponse.json(
          { message: "One or more events are too large to fit in a batch" },
          { status: 400 }
        );
      }
    }

    console.log("Sending batch to Event Hub...");
    await producer.sendBatch(batch);
    console.log("Batch sent successfully!");

    return NextResponse.json({ message: "Events sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Detailed error stack:", error);
    return NextResponse.json(
      {
        message: "Error occurred while sending events",
        error: error.message,
        stack: error.stack, // Add stack trace for debugging
      },
      { status: 500 }
    );

  } finally {
    if (producer) {
      try {
        await producer.close();
        console.log("Event Hub producer closed.");
      } catch (closeError) {
        console.error("Error closing producer:", closeError.message);
      }
    }
  }
}
