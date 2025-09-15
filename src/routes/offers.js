
import express from "express";
import store from "../storage/store.js";
const router = express.Router();


router.post("/", async (req, res) => {
  const offer = req.body;
  if (!offer || !offer.name) {
    return res.status(400).json({ error: "Offer must include at least a name." });
  }

  await store.write("offers", offer);
  res.json({ ok: true, offer });
});


router.get("/", async (req, res) => {
  const offer = await store.read("offers");
  res.json(offer || {});
});

export default router;
