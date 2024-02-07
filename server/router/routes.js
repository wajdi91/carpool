import "dotenv/config";
import express from "express";
const router = express.Router();
import User from "../model/userSchema.js";
import Ride from "../model/rideSchema.js";
import RideRequest from "../model/rideRequestSchema.js";
import authenticate from "../middleware/Authenticate.js";

router.get("/", (req, res) => {
  res.send("Welcome Iteam's CAR POOL SYSTEM");
});
router.post("/user/register", async (req, res) => {
  const { UID, user_type, fname, lname, email, designation, phone, password } =
    req.body;
  console.log(req.body);
  try {
    const user = new User({
      UID,
      user_type,
      fname,
      lname,
      email,
      designation,
      phone,
      password,
    });
    await user.save();
    console.log(user);
    res.status(201).send("USER registered successfully");
  } catch (error) {
    console.log(error);
  }
});
router.post("/user/login", async (req, res) => {
  console.log(req.body);
  const { UID, password } = req.body;
  console.log("UID : " + UID);
  var token;
  try {
    const user = await User.findOne({ UID });
    if (user) {
      if (password == user.password) {
        console.log("Successfullsignin");
        console.log(user);
        JSON.stringify(user);
        token = await user.generateAuthToken();
        console.log("Tokenn /routes/ -> " + token);
        console.log(user);
        res.status(200).send({ user, token });
      } else {
        console.log("Wrong Password");
        res.status(401).send("Wrong Password");
      }
    } else {
      res.status(401).send("INVALID EMAIL");
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/user/:UID/rides", async (req, res) => {
  console.log(req.body);
  const {UID,from,to,nop,doj,price} = req.body;
  try {
    const ride = new Ride({  
      UID,from,
      to,
      nop,
      doj,
      price,
    });
    await ride.save();
    console.log(ride);
    res.send("RIDE PUBLISHED successfully");
  } catch (error) {
    console.log(error,"wajd");
  }
});
router.get('/user/:UID/rides', async (req, res) => {
  const { UID } = req.params;

  try {
    // Assuming the field name in your MongoDB schema is 'UID'
    const rides = await Ride.find({ UID: UID });

    if (!rides || rides.length === 0) {
      return res.status(404).json({ message: 'No rides found for the specified UID' });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get("/rides/all", async (req, res) => {
  try {
    const availableRides = await Ride.find();
    console.log(availableRides);
    res.send(JSON.stringify(availableRides));
  } catch (error) {
    console.log("Error Occurred");
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/rides/:rideId', async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get("/ridesto/:TO", async (req, res) => {
  const to = req.params.TO.toUpperCase();
  console.log("GETTING RIDES TO " + to);

  try {
    let query = { to };

    // Check if date parameters are provided
    if (toDate && fromDate) {
      // Assuming your date field is named "date"
      query.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    const availableRides = await Ride.find(query);

    console.log(availableRides);
    res.send(JSON.stringify(availableRides));
  } catch (error) {
    console.log("Error Occurred");
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
//fix this ->
router.get("/rides/:FROM/:TO", async (req, res) => {
  const to = req.params.TO.toUpperCase();
  const from = req.params.FROM.toUpperCase();
  console.log("FROM - " + from);
  console.log("TO - " + to);
  try {
    const availableRides = await Ride.find({
      $and: [{ from: from }, { to: to }],
    });
    console.log(availableRides);

    res.send(JSON.stringify(availableRides));
  } catch (error) {
    console.log("Error Occured");
    console.log(err);
  }
});

router.get("/ridesto/:TO/:FROM/:MAXP", async (req, res) => {
  // Extract parameters from the request
  const to = req.params.TO.toUpperCase();
  const from = req.params.FROM.toUpperCase();
  const maxp = req.params.MAXP;
  const doj = req.query.doj; // Extract the 'doj' parameter from the query string

  console.log("FROM - " + from);
  console.log("TO - " + to);
  console.log("PRICE - " + maxp);
  console.log("DOJ - " + doj);

  try {
    // Your logic to fetch rides based on parameters
    const availableRides = await Ride.find({
      $and: [{ from: from }, { to: to }, { price: { $gte: 0, $lte: maxp } }],
    });

    console.log(availableRides);
    res.send(JSON.stringify(availableRides));
  } catch (error) {
    console.log("Error Occurred");
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});


// router.get("/user/show/:UID", async (req, res) => {
//   const UID = req.params.UID;
//   console.log(UID);
//   console.log("->");
//   try {
//     console.log("<-");
//     const my_rides = await Ride.find({ PublisherID: UID });
//     console.log("my_rides");
//     console.log(my_rides);
//     res.status(200).send(my_rides);
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get("/user/dashboard", authenticate, function (req, res) {
  console.log("Hello from GET / user / dashboard");
  console.log(req.rootUser);
  res.send(req.rootUser);
});

router.get("/user/data/:UID", async (req, res) => {
  const UID = req.params.UID;
  try {
    const data = await User.findOne({ UID });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// router.post("/ride/request/:RideID/:RequestID", async (req, res) => {});
router.delete("/ride/request/remove/:RideID/:RequestID", async (req, res) => {
  const RideID = req.params.RideID;
  const RequestID = req.params.RequestID;

  console.log(RideID);
  console.log(RequestID);

  try {
    const data = await RideRequest.findOne({
      $and: [{ RideID }, { RequestID }],
    });
    await data.delete();
    console.log(data);
    console.log("Document Deleted");
    res.status(200).json({ message: "Document deleted" });
  } catch (err) {
    console.log("Error occured in deleting request");
    console.log(err);
    res.status(400).json({ message: "Couldn't delete" });
  }
});
router.get("/ride/request/show/:RideID/", async (req, res) => {
  const RideID = req.params.RideID;

  console.log(RideID);
  try {
    const data = await RideRequest.find({ RideID });
    console.log(data);
    res.status(200).send(data);
  } catch (err) {
    console.log();
  }
});

router.post(
  "/ride/request/add/:RideID/:RequestID/:RequestName",
  async (req, res) => {
    const RideID = req.params.RideID;
    const RequestID = req.params.RequestID;
    const RequestName = req.params.RequestName;

    console.log(RideID);
    console.log(RequestID);
    console.log(RequestName);
    try {
      const test_duplicate = await RideRequest.findOne({
        $and: [{ RideID }, { RequestID }],
      });
      if (test_duplicate) {
        console.log("_____________________________________");
        console.log(test_duplicate);
        console.log("_____________________________________");
        res.status(400).json({ message: "ALREADY REQUESTED" });
      } else {
        const new_request = new RideRequest({
          RideID,
          RequestID,
          RequestName,
        });
        await new_request.save();
        res.status(200).json({ message: "RIDE REQUESTED" });
      }
    } catch (err) {
      console.log(err);
    }
  }
);
// POST: Créer une nouvelle demande de trajet
router.post('/user/submit-request', async (req, res) => {
  const { demanderUID, userPhone, publisherUID } = req.body;

  try {
    // Créer une nouvelle demande de trajet
    const newRideRequest = new RideRequest({
      demanderUID,
      userPhone,
      publisherUID,
      status: 'pending',
      // Autres champs de modèle si nécessaire
    });

    // Sauvegarder la demande de trajet dans la base de données
    const savedRideRequest = await newRideRequest.save();

    // Vous pouvez également effectuer d'autres actions ici, comme envoyer une réponse JSON
    res.status(201).json(savedRideRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/user/requests/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // Récupérer les demandes de trajet en fonction de l'UID
    const userRequests = await RideRequest.find({ demanderUID: uid });

    res.status(200).json(userRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Route pour récupérer les demandes pour un certain déposeur de ride
router.get('/user/ride-requests/:UID', async (req, res) => {
  const { UID } = req.params;

  try {
    const rideRequests = await RideRequest.find({ UID:UID });
    res.status(200).json(rideRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route pour accepter ou refuser une demande
router.post('/user/ride-requests/respond', async (req, res) => {
  const { requestId, response } = req.body;

  try {
    let updatedRequest;

    if (response === 'accept') {
      // Mettez à jour la demande avec le statut 'accepté'
      updatedRequest = await RideRequest.findByIdAndUpdate(
        requestId,
        { status: 'accepted' },
        { new: true }
      );
    } else if (response === 'reject') {
      // Mettez à jour la demande avec le statut 'refusé'
      updatedRequest = await RideRequest.findByIdAndUpdate(
        requestId,
        { status: 'rejected' },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: 'Invalid response' });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export default router;
