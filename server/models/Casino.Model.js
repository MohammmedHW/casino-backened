// const mongoose = require("mongoose");

// const CasinoSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     logo: {
//       type: String,
//       required: false,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 5,
//       default: 0,
//     },
//     depositBonus: {
//       type: String,
//       required: false,
//     },
//     welcomeBonus: {
//       type: String,
//       required: false,
//     },
//     order: {
//       type: Number,
//       required: false,
//       default: 0,
//     },
//     generalInfo: {
//       website: { type: String },
//       languages: { type: String },
//       established: { type: String },
//       licences: { type: String },
//       affiliateProgram: { type: String },
//       companyName: { type: String },
//     },
//     characteristics: {
//       casinoType: { type: String },
//       features: { type: String },
//     },
//     paymentInfo: {
//       minimumDeposit: { type: Number, default: 0 },
//       withdrawalMethods: { type: String },
//     },
//     availableCountries: { type: String },
//     editorView: { type: String },
//     generalDescription: { type: String },
//     paymentDescription: { type: String },
//     customerSupportDescription: { type: String },
//     responsibleGamblingDescription: { type: String },
//     visits: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Casino", CasinoSchema);

const mongoose = require("mongoose");

const CasinoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    depositBonus: {
      type: String,
      required: false,
    },
    welcomeBonus: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      required: false,
      default: 0,
    },
    tags: {
      type: [String],
      enum: [
        // Casino Types
        "Crypto Casino",
        "Online Casino",
        "Certified Casino",
        "Mobile Casino",
        "Newest Casino",
        // Bonuses
        "Latest Bonus",
        "Exclusive Bonus",
        "Welcome Bonus",
        "No Deposit",
        "Free Spins Bonus",
        "Cashback Bonus",
        "No Wagering Bonus",
        // Games
        "Casino Games",
        "Table Games",
        "Card Games",
        "Dice Games",
        "Real Money Online Slots",
        "Poker",
        "Bingo",
        "Lottery Games",
        // Slots
        "Video Slots",
        "Classic Slots",
        "Progressive Slots",
        "New Slots",
        // Betting
        "Sports Betting",
        "New Betting Sites",
        "Bet Types",
        "Betting Bonuses",
        "Free Bets",
      ],
      default: [],
    },
    availableCountries: {
      type: [String],
      enum: [
        // North America
        "Canada",
        "United States",
        // Oceania
        "Australia",
        "New Zealand",
        // Europe
        "Austria",
        "Finland",
        "Germany",
        "Ireland",
        "Netherlands",
        "Norway",
        "Sweden",
        "Switzerland",
        "United Kingdom (UK)",
        "European Countries (General)",
        // Asia
        "India",
        // Other/Global
        "Global",
      ],
      default: [],
    },
    generalInfo: {
      website: { type: String },
      languages: { type: String },
      established: { type: String },
      licences: { type: String },
      affiliateProgram: { type: String },
      companyName: { type: String },
    },
    characteristics: {
      casinoType: { type: String },
      features: { type: String },
    },
    paymentInfo: {
      minimumDeposit: { type: Number, default: 0 },
      withdrawalMethods: { type: String },
    },
    editorView: { type: String },
    generalDescription: { type: String },
    paymentDescription: { type: String },
    customerSupportDescription: { type: String },
    responsibleGamblingDescription: { type: String },
    visits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add indexes for better performance
CasinoSchema.index({ name: 1 });
CasinoSchema.index({ tags: 1 });
CasinoSchema.index({ availableCountries: 1 });
CasinoSchema.index({ rating: -1 });
CasinoSchema.index({ order: 1 });

module.exports = mongoose.model("Casino", CasinoSchema);
