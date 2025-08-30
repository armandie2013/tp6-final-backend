import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: Number },
    genres: { type: [String], default: [] },
    poster: { type: String },
    overview: { type: String },

    // ✅ permitir “sin clasificación” y no forzar PG-13
    ageRating: { type: String, enum: ["", "G", "PG", "PG-13", "R", "NC-17"], default: "" },

    // (opcional) si guardás el id de TMDb
    tmdbId: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", MovieSchema);