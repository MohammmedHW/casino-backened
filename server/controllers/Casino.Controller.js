const Casino = require("../models/Casino.Model");

// Get all casinos
exports.getAllCasinos = async (req, res) => {
  try {
    const casinos = await Casino.find().sort({ order: 1 });
    res.json(casinos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single casino
exports.getCasinoById = async (req, res) => {
  try {
    const casino = await Casino.findById(req.params.id);
    if (!casino) {
      return res.status(404).json({ message: "Casino not found" });
    }
    res.json(casino);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create casino
exports.createCasino = async (req, res) => {
  try {
    const casino = new Casino(req.body);
    const savedCasino = await casino.save();
    res.status(201).json(savedCasino);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update casino
exports.updateCasino = async (req, res) => {
  try {
    const casino = await Casino.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!casino) {
      return res.status(404).json({ message: "Casino not found" });
    }
    res.json(casino);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete casino
exports.deleteCasino = async (req, res) => {
  try {
    const casino = await Casino.findByIdAndDelete(req.params.id);
    if (!casino) {
      return res.status(404).json({ message: "Casino not found" });
    }
    res.json({ message: "Casino removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update casino order
// exports.updateCasinoOrder = async (req, res) => {
//   try {
//     const { newOrder } = req.body;

//     if (newOrder === undefined) {
//       return res.status(400).json({ message: "New order is required" });
//     }
//     const casino = await Casino.findByIdAndUpdate(
//       req.params.id,
//       { order: newOrder },
//       { new: true }
//     );

//     if (!casino) {
//       return res.status(404).json({ message: "Casino not found" });
//     }

//     res.json(casino);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

exports.updateCasinoOrder = async (req, res) => {
  try {
    const { newOrder } = req.body;
    const casino = await Casino.findByIdAndUpdate(
      req.params.id,
      { order: newOrder },
      { new: true }
    );

    if (!casino) {
      return res.status(404).json({ message: "Casino not found" });
    }

    res.json(casino);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Increment visits count for a casino
// exports.incrementVisits = async (req, res) => {
//   try {
//     const casino = await Casino.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { visits: 1 } },
//       { new: true }
//     );

//     if (!casino) {
//       return res.status(404).json({ message: "Casino not found" });
//     }

//     res.json({ visits: casino.visits });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
