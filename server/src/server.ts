import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});


// AUTH APIs
app.post("/auth/register", (req, res) => {
  res.json({ message: "register api" })
})

app.post("/auth/login", (req, res) => {
  res.json({ message: "login api" })
})

app.post("/auth/logout", (req, res) => {
  res.json({ message: "logout api" })
})

app.post("/auth/refresh-token", (req, res) => {
  res.json({ message: "refresh token api" })
})

app.post("/auth/forgot-password", (req, res) => {
  res.json({ message: "forgot password api" })
})

app.post("/auth/reset-password", (req, res) => {
  res.json({ message: "reset password api" })
})

app.post("/auth/change-password", (req, res) => {
  res.json({ message: "change password api" })
})

app.post("/auth/update-profile", (req, res) => {
  res.json({ message: "update profile api" })
})

app.get("/auth/me", (req, res) => {
  res.json({ message: "me api" })
})

// end of AUTH APIs

// TENANT (COLLEGE) APIs

app.post("/tenant/create", (req, res) => {
  res.json({ message: "create tenant api" })
})

app.post("/tenant/update", (req, res) => {
  res.json({ message: "update tenant api" })
})

app.post("/tenant/delete", (req, res) => {
  res.json({ message: "delete tenant api" })
})

app.post("/tenant/get", (req, res) => {
  res.json({ message: "get tenant api" })
})

app.post("/tenant/get-all", (req, res) => {
  res.json({ message: "get all tenants api" })
})

//end of TENANT (COLLEGE) APIs


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
