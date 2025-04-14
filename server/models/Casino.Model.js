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
    availableCountries: { type: String },
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

module.exports = mongoose.model("Casino", CasinoSchema);
