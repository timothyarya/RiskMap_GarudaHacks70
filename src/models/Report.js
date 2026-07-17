import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
    {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        description: { type: String, required: true },
        radius: { type: Number, required: true },
        location: { type: String, required: true },
        category: { type: String, required: true },
        upvotes: { type: Number, required: true, default: 1 },
        lastUpvotedAt: { type: Date, required: true, default: Date.now },
    },
    {
        timestamps: true
    }
);

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
export default Report