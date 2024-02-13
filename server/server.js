const express = require("express");
const cors = require("cors");
const app = express();
const port = 4500;
const path = require('path')
const corsOptions = {
  origin: "https://pdf-text-extractor-ozgq.onrender.com/",
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api/pdf", require("./routes/upload"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });