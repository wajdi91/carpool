import mongoose from "mongoose";

const rideRequestSchema = new mongoose.Schema({
  demanderUID: {
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
  demanderUID: {
    type: String, // Assurez-vous que le type correspond à l'UID dans votre application
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  rideID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }, // Ajout de cette ligne

  // Autres champs de modèle si nécessaire
});

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

export default  RideRequest;

