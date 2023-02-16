require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("./env");
mongoose.Promise = require("bluebird");
const morgan = require("morgan");

const PORT = process.env.PORT || 3030;
const isProd = env.NODE_ENV && env.NODE_ENV.toLowerCase() === "production";

const ALLOWED_ORIGINS = ["*", "http://localhost:3000"];

const apiRoutes = require("./routes");

const app = express();
app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if (isProd) {
//     app.use((req, res, next) => {
//         const { origin } = req.headers;
//         if (origin && (ALLOWED_ORIGINS.indexOf(origin) > -1 || ALLOWED_ORIGINS.includes('*'))) {
//             res.setHeader('Access-Control-Allow-Origin', origin);
//         }
//         res.header(
//             'Access-Control-Allow-Headers',
//             'Origin, X-Requested-With, Content-Type, Accept, cookie, accesstoken'
//         );
//         res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//         res.header('Access-Control-Allow-Credentials', 'true');
//         next();
//     });
// } else {
//     app.use(cors());
// }

app.use(cors());

app.use("/", apiRoutes);

mongoose
  .connect(
    //'mongodb+srv://Support:Usersupport123@cluster0.dlktuis.mongodb.net/Liz?retryWrites=true&w=majority',
    //'mongodb+srv://karthick:karthick6@cluster0.jjghc.mongodb.net/liz?retryWrites=true&w=majority',
    "mongodb+srv://karthick:karthick6@cluster0.jjghc.mongodb.net/modem?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log("res", res);
    server = app.listen(PORT, () => {
      console.log(`listening on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.pluralize(null);

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: mongodb`);
});
