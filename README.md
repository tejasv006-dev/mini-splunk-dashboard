# DNA Alignment Visualizer & Diagnostic Engine 🧬

This application is a full-stack bioinformatics tool that uses the **Smith-Waterman dynamic programming algorithm** to align Patient DNA against Reference Genomes. It provides real-time mathematical visualizations and automated clinical diagnosis for genetic diseases.

---

## 🚀 How to Run the Project from the Beginning

There are two ways to run the project: Native Local Development (Recommended for Development) and Docker (Recommended for Deployment).

### Option A: Local Native Setup (Windows/Mac/Linux)

**1. Start the Python Backend**
The backend requires Python (version 3.9+) to do the heavy mathematical calculations.
```bash
# Navigate to the backend directory
cd backend

# Install the required Python packages
pip install -r requirements.txt

# Start the FastAPI server on port 8000
python -m uvicorn main:app --reload
# (Note: On some Windows environments, use `py -m uvicorn ...` or provide full path)
```

**2. Start the React Frontend**
The frontend requires Node.js to be installed.
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install the Node dependencies
npm install

# Start the Vite development server
npm run dev
```

**3. Test the App**
* Open your browser and navigate to `http://localhost:5173/`. Both servers must be running simultaneously.

### Option B: Using Docker (One Command)
If you have Docker Desktop installed, you do not need to install Python or Node manually.

```bash
# In the root folder of the project, simply run:
docker-compose up --build
```
* Access the app at `http://localhost:80/`

---

## ✅ How to Test if the Project is Correct 

To prove that the Smith-Waterman math is correct and the UI handles scenarios properly, perform the following tests:

### Test 1: The Exact Match (Sanity Check)
1. Set the **Patient Sequence** to `GATTACA`.
2. Set the **Reference Sequence** to `GATTACA`.
3. **Verify:** Look at the heatmap matrix. A perfectly straight, unbroken diagonal line should form from the top-left to the bottom-right. The Clinical Insights panel should turn **Green** and explicitly state: *"No mutations detected."*

### Test 2: The Sickle Cell Substitution (SNP Test)
1. Click the **"Load Clinical Case Study"** dropdown at the top left.
2. Select **"Sickle Cell Anemia (HBB SNP)"**.
3. **Verify:** Notice how the sequence deviates by exactly one letter (`A` substituted for `T`). The matrix will calculate a slightly lower score at that specific junction. The Clinical Insight panel MUST turn **Red** and pop up the specific Sickle Cell Diagnosis report.

### Test 3: The Gap Penalty Enforcement (Indel Test)
1. Type `ATGCATGC` in both boxes to get a perfect match line.
2. Delete two letters from the *middle* of the Patient Sequence (e.g., `ATGGC`).
3. Slide the **Gap Penalty** slider to `-5` (Maximum Penalty).
4. **Verify:** The dynamic programming algorithm should severely punish the break. The visual "traceback" path on the heatmap will either break completely or take a harsh detour, visually proving that the algorithm punishes Missing Data just like real bioinformatics sequencers do.

### Test 4: FASTA File Upload
1. Create a raw text file named `test.fasta`. Add a line starting with `>Patient1`, and put `ATCGTACG` on the next line.
2. Click **"Upload .FASTA"** on the UI and upload your file.
3. **Verify:** The UI should automatically strip the `>Patient1` metadata header and format the string cleanly into the text box, triggering an immediate recalculation.
