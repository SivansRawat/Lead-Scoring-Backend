import express from "express";
import store from "../storage/store.js";
import { Parser } from "json2csv";

const router = express.Router();

router.get("/", async (req, res) => {
  const results = await store.read("results");
  res.json(results || []);
});

router.get("/export", async (req, res) => {
  const results = await store.read("results");
  const fields = ["name","role","company","industry","intent","score","reasoning","rule_score","ai_points"];
  const parser = new Parser({ fields });
  const csv = parser.parse(results || []);
  res.header("Content-Type", "text/csv");
  res.attachment("results.csv");
  res.send(csv);
});

export default router;
