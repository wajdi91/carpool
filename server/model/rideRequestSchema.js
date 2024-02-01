import mongoose from "mongoose";

const rideRequestSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  publisherUID: {
    type: String,
    required: true,
  },
  // Autres champs de modèle si nécessaire
});

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

export default  RideRequest;

