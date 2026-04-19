import createServer from "./server.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
