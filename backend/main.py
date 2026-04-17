from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import AlignmentRequest, AlignmentResponse, NCBIRequest, NCBIResponse
from algorithm import perform_smith_waterman
import httpx

app = FastAPI(title="Smith-Waterman Alignment API")

# Configure CORS
origins = [
    "http://localhost:5173",  # React app port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Smith-Waterman API is running"}

@app.post("/align", response_model=AlignmentResponse)
def align_sequences(request: AlignmentRequest):
    result = perform_smith_waterman(
        request.patientSeq.upper(),
        request.refSeq.upper(),
        request.matchScore,
        request.mismatchScore,
        request.gapPenalty
    )
    return AlignmentResponse(**result)

@app.post("/ncbi/fetch", response_model=NCBIResponse)
async def fetch_ncbi_sequence(request: NCBIRequest):
    # Step 1: ESearch (Search for nucleotide matching the gene and organism)
    search_url = (
        f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&"
        f"term={request.gene_name}[Gene]+AND+{request.organism}[Organism]&retmax=1&retmode=json"
    )
    
    async with httpx.AsyncClient() as client:
        try:
            search_res = await client.get(search_url)
            search_data = search_res.json()
            
            id_list = search_data.get("esearchresult", {}).get("idlist", [])
            if not id_list:
                raise HTTPException(status_code=404, detail="No matching sequences found on NCBI.")
            
            target_id = id_list[0]
            
            # Step 2: EFetch (Retrieve FASTA for the target ID)
            fetch_url = (
                f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&"
                f"id={target_id}&rettype=fasta&retmode=text"
            )
            fetch_res = await client.get(fetch_url)
            
            if fetch_res.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to retrieve sequence from NCBI.")
            
            fasta_text = fetch_res.text
            
            # Parse FASTA: Clean headers and join lines
            lines = fasta_text.splitlines()
            if not lines:
                raise HTTPException(status_code=500, detail="Empty FASTA response.")
                
            header = lines[0].replace(">", "")
            sequence = "".join(lines[1:]).replace(" ", "").upper()
            
            # Truncate to reasonable visual length (e.g. 1000 bases)
            display_seq = sequence[:1000]
            
            return NCBIResponse(
                seq=display_seq,
                id=target_id,
                name=header
            )
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=str(e))
