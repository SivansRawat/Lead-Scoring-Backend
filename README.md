# Lead Scoring Backend

A backend service to manage leads and product offers, score each lead’s buying intent using **rule-based logic + AI reasoning**, and return results via APIs.

---

## 🏗️ Features

- Upload **offers** and **leads** (CSV supported)
- Rule-based lead scoring (role relevance, industry match, data completeness)
- AI-based scoring using **OpenAI GPT**
- Combined lead score (0–100) and intent label (High / Medium / Low)
- Export results as JSON (CSV optional)
- Unit tests for scoring rules

---

## ⚡ Tech Stack

- Node.js & Express
- OpenAI GPT API
- File-based JSON storage
- Multer for CSV uploads
- Jest for unit testing

---

## 📦 Setup

1.  Clone the repo:

    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/lead-scoring-backend.git
    cd lead-scoring-backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file (or copy `.env.example`) with:

    ```env
    PORT=4000
    OPENAI_API_KEY=<your_openai_api_key>
    STORAGE_PATH=./data
    ```

4.  Start the server:

    ```bash
    npm run dev
    ```

    Server will run at: `http://localhost:4000`

---

## 🛠️ API Endpoints

### 1. Create Offer

-   `POST /offer`
-   **Body Example:**
    ```json
    {
      "name": "AI Outreach Automation",
      "value_props": ["24/7 outreach", "6x more meetings"],
      "ideal_use_cases": ["B2B SaaS mid-market"]
    }
    ```
-   **Response:**
    ```json
    {
      "ok": true,
      "offer_id": "uuid"
    }
    ```

### 2. Upload Leads (CSV)

-   `POST /leads/upload`
-   Accepts CSV with columns: `name,role,company,industry,location,linkedin_bio`
-   **Form-data key:** `file`
-   **Response Example:**
    ```json
    {
      "ok": true,
      "added": 5
    }
    ```

### 3. Get Leads

-   `GET /leads`
-   **Response Example:**
    ```json
    [
      {
        "id": "uuid",
        "name": "John Doe",
        "role": "Decision Maker",
        "company": "TechCorp",
        "industry": "Software",
        "location": "NY",
        "linkedin_bio": "Growth hacker"
      }
    ]
    ```

### 4. Score Leads

-   `POST /score`
-   Runs rule-based + AI scoring for all uploaded leads.
-   AI classifies intent as `High` / `Medium` / `Low`.
-   **Response Example:**
    ```json
    [
      {
        "name": "John Doe",
        "role": "Decision Maker",
        "company": "TechCorp",
        "intent": "High",
        "score": 85,
        "reasoning": "Fits ICP SaaS mid-market and role is decision maker."
      }
    ]
    ```

### 5. Get Results

-   `GET /results`
-   Returns scored leads in JSON format (same as above).

---

## 🧮 Scoring Logic

### Rule Layer (max 50 points)

| Rule                | Points |
| ------------------- | ------ |
| Role relevance      | Decision Maker = 20, Influencer = 10, Else = 0 |
| Industry match      | Exact ICP = 20, Adjacent = 10, Else = 0 |
| Data completeness   | All fields present = 10 |

### AI Layer (max 50 points)

-   Uses OpenAI GPT to classify intent and give reasoning.
-   `High` = 50, `Medium` = 30, `Low` = 10
-   **Final Score** = `rule_score` + `ai_points` (0–100)

---

## 🧪 Testing

Unit tests are included for the rule-based scoring:

```bash
npm test


All tests must pass before scoring production leads.

---

## ⚙️ AI Integration

AI receives offer + lead data.

**Prompt example:**



You are a concise sales-intent classifier. Classify intent as High, Medium, or Low and provide a 1-2 sentence reasoning.
Respond ONLY in JSON: {"intent":"High","reasoning":"..."}




**Default fallback:** `Medium` intent if AI fails or key missing.

---

## 📝 Notes

-   Make sure `.env` contains a valid `OPENAI_API_KEY`.
-   CSV uploads must have headers: `name,role,company,industry,location,linkedin_bio`.
-   Node v22+ recommended.

---

## 📤 Optional Features / Bonus

-   Export results as CSV
-   Dockerize backend
-   Deploy on free cloud (Render, Railway, Heroku, etc.)

---

## 📌 Deployment

Can be deployed using services like Render, Railway, Vercel, or Heroku. Once deployed, update README with live API base URL for testing.

---

## 👏 Author

Sivans Rawat – Backend Developer & Microsoft Student Ambassador