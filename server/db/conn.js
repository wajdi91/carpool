import mongoose from "mongoose";
const DB =
"mongodb+srv://wajdi:wajdi@cluster0.dorb2zf.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });
