
// import express from "express";
// import store from "../storage/store.js";
// const router = express.Router();


// router.post("/", async (req, res) => {
//   const offer = req.body;
//   if (!offer || !offer.name) {
//     return res.status(400).json({ error: "Offer must include at least a name." });
//   }

//   await store.write("offers", offer);
//   res.json({ ok: true, offer });
// });


// router.get("/", async (req, res) => {
//   const offer = await store.read("offers");
//   res.json(offer || {});
// });

// export default router;




import express from "express";
import { offers } from "../storage/store.js";

const router = express.Router();

// Add a new offer
router.post("/", (req, res) => {
  const offer = req.body;
  if (!offer || !offer.name) {
    return res.status(400).json({ error: "Offer must include at least a name." });
  }

  offers.splice(0, offers.length, offer); // replace current offer
  res.json({ ok: true, offer });
});

// Get current offer
router.get("/", (req, res) => {
  res.json(offers[0] || {});
});

export default router;
