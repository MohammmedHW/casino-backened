const express = require("express");
const router = express.Router();
const casinoController = require("../controllers/Casino.Controller");
const auth = require("../middlewares/auth");

// Get all casinos
router.get("/", casinoController.getAllCasinos);

// Get single casino
router.get("/:id", casinoController.getCasinoById);

// Create casino (admin only)
router.post("/", auth, casinoController.createCasino);

// Update casino (admin only)
router.put("/:id", auth, casinoController.updateCasino);

// Delete casino (admin only)
router.delete("/:id", auth, casinoController.deleteCasino);

// Update casino order (admin only)
router.put("/reorder/:id", auth, casinoController.updateCasinoOrder);

// Increment visits count for a casino
// router.post("/:id/visit", casinoController.incrementVisits);

router.get("/slug/:slug", casinoController.getCasinoBySlug);

module.exports = router;
