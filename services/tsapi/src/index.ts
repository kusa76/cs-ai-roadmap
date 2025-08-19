import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const querySchema = z.object({ name: z.string().min(1) });

app.get("/hello", (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "name is required" });
  return res.json({ message: `Hello, ${parsed.data.name}!` });
});

const port = process.env.PORT || 3000;
if (import.meta.url === `file://${process.argv[1]}`) app.listen(port, () => console.log(`tsapi on ${port}`));

export default app;
