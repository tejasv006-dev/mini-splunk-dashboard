from pydantic import BaseModel
from typing import List, Tuple

class AlignmentRequest(BaseModel):
    patientSeq: str
    refSeq: str
    matchScore: int = 2
    mismatchScore: int = -1
    gapPenalty: int = -2

class AlignmentResponse(BaseModel):
    matrix: List[List[int]]
    paths: List[Tuple[int, int]]
    seq1: List[str]
    seq2: List[str]
    score: int

class NCBIRequest(BaseModel):
    gene_name: str
    organism: str = "Homo sapiens"

class NCBIResponse(BaseModel):
    seq: str
    id: str
    name: str
