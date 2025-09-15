// import fs from "fs/promises";
// import path from "path";

// const STORAGE_PATH = process.env.STORAGE_PATH || "./data";
// await fs.mkdir(STORAGE_PATH, { recursive: true });

// const FILES = {
//   leads: path.join(STORAGE_PATH, "leads.json"),
//   offers: path.join(STORAGE_PATH, "offers.json"),
//   results: path.join(STORAGE_PATH, "results.json"),
// };

// async function _ensure(file, fallback) {
//   try {
//     await fs.access(file);
//   } catch {
//     await fs.writeFile(file, JSON.stringify(fallback, null, 2));
//   }
// }

// await Promise.all([
//   _ensure(FILES.leads, []),
//   _ensure(FILES.offers, {}),
//   _ensure(FILES.results, []),
// ]);

// export async function read(fileKey) {
//   const file = FILES[fileKey];
//   const raw = await fs.readFile(file, "utf8");
//   return JSON.parse(raw);
// }
// export async function write(fileKey, data) {
//   const file = FILES[fileKey];
//   await fs.writeFile(file, JSON.stringify(data, null, 2));
// }
// export default { read, write };




// storage/store.js

// In-memory storage (resets on each server restart)
export const leads = [];
export const offers = [];
export const results = [];

// No file read/write anymore
const store = {
  read: async (key) => {
    if (key === "leads") return leads;
    if (key === "offers") return offers[0] || null;
    if (key === "results") return results;
    return null;
  },
  write: async (key, value) => {
    if (key === "leads") {
      leads.splice(0, leads.length, ...value);
    } else if (key === "offers") {
      offers.splice(0, offers.length, value);
    } else if (key === "results") {
      results.splice(0, results.length, ...value);
    }
  },
};

export default store;
