import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

interface Role {
  role: "parent" | "student" | "faculty";
}


// AUTH APIs

app.post("/auth/:role/login", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `login api for ${role}` })
})

app.post("/auth/:role/logout", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `logout api for ${role}` })
})

app.post("/auth/:role/refresh-token", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `refresh token api for ${role}` })
})

app.post("/auth/:role/forgot-password", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `forgot password api for ${role}` })
})

app.post("/auth/:role/reset-password", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `reset password api for ${role}` })
})

app.post("/auth/:role/change-password", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `change password api for ${role}` })
})

app.post("/auth/:role/update-profile", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `update profile api for ${role}` })
})

app.get("/auth/:role/me", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `me api for ${role}` })
})

// end of AUTH APIs


app.post("/:role/create", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `create api for ${role}` })
})

app.post("/:role/delete", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `delete api for ${role}` })
})

app.post("/:role/update", (req, res) => {
  const { role } = req.params as Role;
  res.json({ message: `update api for ${role}` })
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
