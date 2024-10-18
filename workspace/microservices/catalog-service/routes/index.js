const express = require("express");

const CatalogService = require("../lib/CatalogService")

const router = express.Router();

// Get all items
router.get("/items", async (req, res) => {
try {
  const items = await CatalogService.getAll();
  return res.json(items);
} catch (error) {
  console.error(error);
  return res.status(500).json({error: "Internal Server Error"})
}
});

// Get one item
router.get("/items/:id", async (req, res) => {
  try {
    const item = await CatalogService.getOne(req.params.id);
    if(!item) {
      return res.status(404).json({error: "Item not found."})
    }
    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"})
  }
  });

  // Create new item
  router.post("/items", async (req, res) => {
    try {
      const newItem = await CatalogService.create(req.body);
      return res.json(newItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Internal Server Error"})
    }
    });

  // Update an item
  router.put("/items/:id", async (req, res) => {
    try {
      const updateItem = await CatalogService.update(req.params.id, req.body);
      if(!updateItem) {
        return res.status(404).json({error: "Item not found."})
      }
      return res.json(updateItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Internal Server Error"})
    }
    });

    // Delete an item
    router.delete("/items/:id", async (req, res) => {
      try {
        const deleteItem = await CatalogService.remove(req.params.id);
        if(deleteItem.deletedCount === 0) {
          return res.status(404).json({error: "Item not found."})
        }
        return res.status(204).send();
      } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"})
      }
      });

module.exports = router;
