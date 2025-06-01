import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ParkingForm.css";

const ParkingForm = () => {
    const { user } = useAuth();
    const location = useLocation();
    const selectedParkingArea = location.state?.parkingArea || "Main Campus";

    const [formData, setFormData] = useState({
        name: user?.username || "",
        category: "Visitor",
        vehicleType: "Two Wheeler",
        vehicleBrand: "",
        vehicleNumber: "",
        vehicleColor: "",
        fromDate: "",
        toDate: "",
        parkingArea: selectedParkingArea,
    });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            parkingArea: selectedParkingArea,
        }));
    }, [selectedParkingArea]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "vehicleNumber") value = value.toUpperCase();

        // Reset brand when type changes
        if (name === "vehicleType") {
            setFormData({ ...formData, vehicleType: value, vehicleBrand: "" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/parking/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                alert("Parking request submitted successfully!");
                setFormData({
                    name: user?.username || "",
                    category: "Visitor",
                    vehicleType: "Two Wheeler",
                    vehicleBrand: "",
                    vehicleNumber: "",
                    vehicleColor: "",
                    fromDate: "",
                    toDate: "",
                    parkingArea: selectedParkingArea,
                });
            } else {
                alert("Failed to submit request. Please try again.");
            }
        } catch (error) {
            alert("Error submitting request. Check console for details.");
            console.error(error);
        }
    };

    const vehicleBrands = {
        "Two Wheeler": [
            "Royal Enfield", "Hero MotoCorp", "Honda Motorcycle", "TVS", "Bajaj",
            "Yamaha", "Suzuki Bikes", "KTM", "Jawa", "Benelli",
            "Ather Energy", "Ola Electric", "Bajaj Chetak", "TVS iQube",
            "Hero Electric", "Simple Energy", "Ampere", "Okaya", "Bounce", "other"
        ],
        "Four Wheeler": [
            "Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra", "Honda Cars",
            "Toyota", "Kia", "Renault", "Volkswagen", "Skoda", "other"
        ],
        "Others": ["Tractor", "E-Rickshaw", "Forklift", "Mini Truck", "other"]
    };

    const filteredBrands = vehicleBrands[formData.vehicleType] || [];

    return (
        <div className="parking-form-container">
            <h2>Parking Request Form</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} readOnly required />
                </label>

                <label>
                    Category:
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="Visitor">Visitor</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Student">Student</option>
                        <option value="Parents">Parents</option>
                    </select>
                </label>

                <label>
                    Vehicle Type:
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                        <option value="Two Wheeler">Two Wheeler</option>
                        <option value="Four Wheeler">Four Wheeler</option>
                        <option value="Others">Others</option>
                    </select>
                </label>

                <label>
                    Vehicle Brand:
                    <select
                        name="vehicleBrand"
                        value={formData.vehicleBrand}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Brand</option>
                        {filteredBrands.map((brand, index) => (
                            <option key={index} value={brand}>{brand}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Vehicle Number:
                    <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
                </label>

                <label>
                    Vehicle Color:
                    <input type="text" name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} required />
                </label>

                <div className="calendar-container">
                    <label>
                        From Date:
                        <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
                    </label>
                    <label>
                        To Date:
                        <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
                    </label>
                </div>

                <label>
                    Parking Area:
                    <select name="parkingArea" value={formData.parkingArea} onChange={handleChange}>
                        <option value="Main Campus">Main Campus</option>
                        <option value="Tech Park">Tech Park</option>
                        <option value="Tech Tower">Tech Tower</option>
                        <option value="T.P Ganesan Auditorium">T.P Ganesan Auditorium</option>
                        <option value="C.V Raman Block">C.V Raman Block</option>
                        <option value="MBA Building">MBA Building</option>
                        <option value="School Of Law">School Of Law</option>
                    </select>
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ParkingForm;
