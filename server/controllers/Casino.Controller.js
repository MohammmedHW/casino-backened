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
    const { order: newOrder } = req.body;
    const session = await Casino.startSession();
    session.startTransaction();

    try {
      // Get the casino we're updating
      const casinoToUpdate = await Casino.findById(req.params.id).session(
        session
      );
      if (!casinoToUpdate) {
        throw new Error("Casino not found");
      }

      const oldOrder = casinoToUpdate.order;

      if (newOrder !== undefined && newOrder !== oldOrder) {
        // If order is being changed, adjust other casinos
        if (newOrder < oldOrder) {
          // Moving up - increment orders between new and old positions
          await Casino.updateMany(
            {
              _id: { $ne: req.params.id },
              order: { $gte: newOrder, $lt: oldOrder },
            },
            { $inc: { order: 1 } },
            { session }
          );
        } else {
          // Moving down - decrement orders between old and new positions
          await Casino.updateMany(
            {
              _id: { $ne: req.params.id },
              order: { $gt: oldOrder, $lte: newOrder },
            },
            { $inc: { order: -1 } },
            { session }
          );
        }
      }

      // Update the casino
      const updatedCasino = await Casino.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      res.json(updatedCasino);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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

exports.updateCasinoOrder = async (req, res) => {
  try {
    const { newOrder } = req.body;

    // Find the casino to update
    const casinoToUpdate = await Casino.findById(req.params.id);
    if (!casinoToUpdate) {
      return res.status(404).json({ message: "Casino not found" });
    }

    // Get current order of the casino
    const oldOrder = casinoToUpdate.order;

    // Update all affected casinos in a transaction
    const session = await Casino.startSession();
    session.startTransaction();

    try {
      // Shift other casinos' orders
      if (newOrder < oldOrder) {
        // Moving up - increment orders between new and old positions
        await Casino.updateMany(
          { order: { $gte: newOrder, $lt: oldOrder } },
          { $inc: { order: 1 } },
          { session }
        );
      } else {
        // Moving down - decrement orders between old and new positions
        await Casino.updateMany(
          { order: { $gt: oldOrder, $lte: newOrder } },
          { $inc: { order: -1 } },
          { session }
        );
      }

      // Update the moved casino's order
      casinoToUpdate.order = newOrder;
      await casinoToUpdate.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.json(casinoToUpdate);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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

exports.getCasinoBySlug = async (req, res) => {
  try {
    const casino = await Casino.findOne({ slug: req.params.slug });
    if (!casino) {
      return res.status(404).json({ message: "Casino not found" });
    }
    res.json(casino);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
