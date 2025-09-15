
import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import store from "../storage/store.js";


const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Add single lead via JSON
router.post("/", async (req, res) => {
  const lead = {
    id: uuidv4(),
    name: req.body.name || "",
    role: req.body.role || "",
    company: req.body.company || "",
    industry: req.body.industry || "",
    location: req.body.location || "",
    linkedin_bio: req.body.linkedin_bio || ""
  };

  const existing = await store.read("leads");
  await store.write("leads", existing.concat(lead));
  res.status(201).json(lead);
});


router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Missing file" });
  const leads = [];
  const stream = fs.createReadStream(req.file.path).pipe(csvParser());

  stream.on("data", (row) => {

    const lead = {
      id: uuidv4(),
      name: row.name || "",
      role: row.role || "",
      company: row.company || "",
      industry: row.industry || "",
      location: row.location || "",
      linkedin_bio: row.linkedin_bio || ""
    };
    leads.push(lead);
  });

  stream.on("end", async () => {

    const existing = await store.read("leads");
    const all = existing.concat(leads);
    await store.write("leads", all);
    fs.unlink(req.file.path, ()=>{});
    res.json({ ok: true, added: leads.length });
  });

  stream.on("error", (err) => {
    res.status(500).json({ error: "CSV parse error", details: err.message });
  });
});

router.get("/", async (req, res) => {
  const leads = await store.read("leads");
  res.json(leads);
});

export default router;
