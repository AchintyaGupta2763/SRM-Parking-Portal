const mongoose = require("mongoose");

const ParkingRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ["Visitor", "Faculty", "Student", "Parents"], required: true },
    vehicleType: { type: String, enum: ["car", "bike", "scooty"], required: true },
    vehicleBrand: { type: String, required: true },
    vehicleNumber: { type: String, required: true, uppercase: true },
    vehicleColor: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    parkingArea: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
    adminSignature: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ParkingRequest", ParkingRequestSchema);
