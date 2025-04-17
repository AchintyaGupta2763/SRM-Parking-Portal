const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const ParkingRequest = require("../models/ParkingRequest");
const sendEmail = require('../controllers/sendEmail');
const User = require("../models/User");


// Fetch all pending requests
router.get("/pending-requests", verifyAdmin, async (req, res) => {
  try {
    const requests = await ParkingRequest.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
  }
});

// Approve or Reject Request
router.put("/approve/:id", verifyAdmin, async (req, res) => {
  try {
    const { status, adminSignature } = req.body; // Keep using adminSignature for storing QR code

    if (status === "approved" && !adminSignature) {
      return res.status(400).json({ success: false, message: "QR code required for approval" });
    }

    const updatedRequest = await ParkingRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminSignature: status === "approved" ? adminSignature : "" }, // Store QR code in adminSignature
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const user = await User.findOne({ username: updatedRequest.name });

    if (user) {
      const subject = `Your Parking Request Has Been ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      const text =
        status === "approved"
          ? `Dear ${updatedRequest.name},\n\nYour parking request has been approved. You can donwnload the pass from the website.\n\nThank you.`
          : `Dear ${updatedRequest.name},\n\nWe regret to inform you that your parking request has been rejected.\n\nThank you.`;

      await sendEmail(user.email, subject, text);
    }


    res.json({ success: true, message: `Request ${status} successfully`, request: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating request", error: error.message });
  }
});

module.exports = router;
