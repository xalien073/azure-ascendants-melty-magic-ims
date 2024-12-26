// ims/src/app/page.js

"use client";
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  Container,
  Dialog,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ChocolateInventory() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [thumbnails, setThumbnails] = useState([]); // State to manage thumbnails
  const [openModal, setOpenModal] = useState(false); // State to control modal

  const fetchThumbnails = async () => {
    try {
      const response = await fetch("/api/get-thumbnails");
      const data = await response.json();
      if (response.ok) {
        setThumbnails(data.thumbnails);
      } else {
        console.error("Error fetching thumbnails:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch thumbnails:", error);
    }
  };

  useEffect(() => {
    fetchThumbnails(); // Fetch on initial render

    const intervalId = setInterval(() => {
      fetchThumbnails(); // Update every 10 seconds
    }, 30000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(file);
      // Upload image
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        alert("Image upload failed.");
        return;
      }

      const { blobUrl } = await uploadRes.json();

      // Save metadata
      const saveRes = await fetch("/api/save-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          price,
          quantityAvailable,
          blobUrl,
        }),
      });

      if (!saveRes.ok) {
        alert("Failed to save metadata.");
        return;
      }

      alert("Inventory updated successfully!");

      try {
                // Send event
                const response = await fetch("/api/send-event", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify([{ body: { name, brand, blobUrl } }]),
                });
        
                if (!response.ok) {
                  throw new Error(`Failed to send event: ${response.statusText}`);
                }
        
                alert("Event sent to Event Hub!");
              } catch (error) {
                console.error("Error sending event:", error);
                alert("An error occurred while sending the event. Please try again.");
              }

      // Reset form fields
      setFile(null);
      setName("");
      setBrand("");
      setPrice("");
      setQuantityAvailable("");

      // Close the modal after successful submission
      setOpenModal(false);
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <h1>
        Melty Magic Inventory Management - Azure Ascendants
      </h1>
      <hr></hr>
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Add Chocolate
        </Button>
      </Box>

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpenModal(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ position: "relative", p: 2 }}>
          {/* Close Icon */}
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: "100%",
              margin: "0 auto",
              mt: 4,
            }}
          >
            <TextField
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <TextField
              label="Chocolate Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <TextField
              label="Quantity Available"
              type="number"
              value={quantityAvailable}
              onChange={(e) => setQuantityAvailable(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Thumbnails Grid */}
      <Grid container spacing={3}>
        {thumbnails.map((url, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 1505 }}>
              <CardMedia component="img" height="300" image={url} alt={url} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

