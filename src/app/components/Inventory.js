// ims/src/app/components/Inventory.js

"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function Inventory({ inventory, updateProduct }) {
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setUpdatedPrice(product.price);
    setUpdatedQuantity(product.quantityAvailable);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setUpdatedPrice("");
    setUpdatedQuantity("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Updated Product:", {
      ...selectedProduct,
      price: updatedPrice,
      quantityAvailable: updatedQuantity,
    });
    try {
      const response = await fetch("/api/update-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedProduct.name,
          price: updatedPrice,
          quantityAvailable: updatedQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      updateProduct(selectedProduct.name, updatedPrice, updatedQuantity);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating the product:", error);
      alert("An error occurred while updating the product. Please try again.");
    }

    handleCloseDialog();
  };

  return (
    <>
      {loading ? (
        <Typography variant="h5" color="textSecondary" align="center">
          Loading...
        </Typography>
      ) : inventory && inventory.length > 0 ? (
        <Grid container spacing={3}>
          {inventory.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 350, padding: 2 }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Brand: {product.brand}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {product.quantityAvailable}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                    style={{ marginTop: "10px" }}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h5" color="textSecondary" align="center">
          No products in the inventory.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Price"
            type="number"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Quantity"
            type="number"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}



// // ims/src/app/components/Inventory.js

// "use client";
// import { useState } from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
// } from "@mui/material";

// export default function Inventory({ inventory, updateProduct }) {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [updatedPrice, setUpdatedPrice] = useState("");
//   const [updatedQuantity, setUpdatedQuantity] = useState("");

//   // Handle dialog open/close
//   const handleOpenDialog = (product) => {
//     setSelectedProduct(product);
//     setUpdatedPrice(product.price);
//     setUpdatedQuantity(product.quantityAvailable);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedProduct(null);
//     setUpdatedPrice("");
//     setUpdatedQuantity("");
//   };

//   // Handle saving edits
//   const handleSave = async (e) => {
//     // Update product logic here (e.g., API call or state update)
//     e.preventDefault();
//     console.log("Updated Product:", {
//       ...selectedProduct,
//       price: updatedPrice,
//       quantityAvailable: updatedQuantity,
//     });
//     try {
//       // update product
//       const response = await fetch("/api/update-product", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           { name: selectedProduct.name, price: updatedPrice, quantityAvailable: updatedQuantity }
//         ),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update product: ${response.statusText}`);
//       }

//       updateProduct(selectedProduct.name, updatedPrice, updatedQuantity);
//       alert("Product updated successfully!");
//     } catch (error) {
//       console.error("Error updating the product:", error);
//       alert("An error occurred while updating the product. Please try again.");
//     }

//     handleCloseDialog();
//   };

//   return (
//     <>
//       {/* Product Grid */}
//       {inventory && inventory.length > 0 ? (
//         <Grid container spacing={3}>
//           {inventory.map((product, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card sx={{ maxWidth: 350, padding: 2 }}>
//                 <img
//                   src={product.imageUrl}
//                   alt={product.name}
//                   style={{ width: "100%", height: "200px", objectFit: "cover" }}
//                 />
//                 <CardContent>
//                   <Typography variant="h6">{product.name}</Typography>
//                   <Typography variant="subtitle1" color="textSecondary">
//                     Brand: {product.brand}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     Price: ${product.price}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     Quantity: {product.quantityAvailable}
//                   </Typography>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => handleOpenDialog(product)}
//                     style={{ marginTop: "10px" }}
//                   >
//                     Edit
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Typography variant="h5" color="textSecondary" align="center">
//           No products in the inventory.
//         </Typography>
//       )}

//       {/* Edit Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Edit Product</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Price"
//             type="number"
//             value={updatedPrice}
//             onChange={(e) => setUpdatedPrice(e.target.value)}
//             fullWidth
//             margin="dense"
//           />
//           <TextField
//             label="Quantity"
//             type="number"
//             value={updatedQuantity}
//             onChange={(e) => setUpdatedQuantity(e.target.value)}
//             fullWidth
//             margin="dense"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSave} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }
