const express = require("express");
const bodyParser = require("body-parser");

const authService = require("./authService"); // Import your user service methods
//import authenticate middleware
const authMiddleware = require("../../middleware/authMiddleware");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  authService.loginUser(email, password, (response) => {
    if (response.success) {
      // If login is successful, generate a JWT and send it in a cookie
      const token = response.token;
      res.cookie("jwt", token, { httpOnly: true });
      res.json({ success: true, message: "Logged in successfully" });
    } else {
      res.json(response); // Return the failure response from userService
    }
  });
});

//Protected Route
app.get("/me", authMiddleware.authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

app.get(
  "/admin",
  authMiddleware.authenticateUser,
  authMiddleware.authoriseAdmin,
  async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.send("An error occured");
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
