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
import Inventory from './components/Inventory.js';

export default function ChocolateInventory() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [inventory, setInventory] = useState([]); // State to manage inventory
  const [openModal, setOpenModal] = useState(false); // State to control modal

  const fetchInventory= async () => {
    try {
      const response = await fetch("/api/get-inventory");
      const data = await response.json();
      if (response.ok) {
        setInventory(data.inventory);
      } else {
        console.error("Error fetching inventory:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory(); // Fetch on initial render

    const intervalId = setInterval(() => {
      fetchInventory(); // Update every 5minutes
    }, 300000);

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

      try {
        // Send event
        const response = await fetch("/api/send-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            { body: { name, brand, price, quantityAvailable, blobUrl } },
          ]),
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

  const updateProduct = (name, price, quantityAvailable) => {
    // Logic to update the product
    console.log('Updating product:', name, price, quantityAvailable);
    setInventory((prevInventory) =>
      prevInventory.map((product) =>
        product.name === name
          ? { ...product, price, quantityAvailable } // Update matching product
          : product // Keep other products unchanged
      )
    );
  };
  
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 4 }}>
      <h2>Melty Magic Inventory Management - Azure Ascendants</h2>
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

      <Inventory inventory={inventory} updateProduct={updateProduct} />
    </Container>
  );
}
