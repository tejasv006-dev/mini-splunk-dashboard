export const CLINICAL_PRESETS = [
  {
    name: "Custom (Manual Entry)",
    patientSeq: "",
    refSeq:     "",
    diagnosis: null
  },
  {
    name: "Sickle Cell Anemia (HBB SNP)",
    patientSeq: "GTGCACCTGACTCCTGTGGAG", // Mutated (A -> T substitution)
    refSeq:     "GTGCACCTGACTCCTGAGGAG", // Healthy
    diagnosis: {
      title: "Diagnosis: Sickle Cell Anemia",
      severity: "critical", // For styling purposes
      description: "A single nucleotide substitution (A -> T) was detected in the HBB gene. This missense mutation causes glutamic acid to be replaced by valine, resulting in abnormal hemoglobin S (HbS) which distorts red blood cells."
    }
  },
  {
    name: "Cystic Fibrosis (CFTR ∆F508)",
    patientSeq: "ATCATCTTTGGTGTT", // Deleted CTT
    refSeq:     "ATCATCTTTGGTGTTTCCTATGAT", // Healthy snippet
    diagnosis: {
      title: "Diagnosis: Cystic Fibrosis (∆F508)",
      severity: "critical",
      description: "A deletion of three nucleotides (CTT) was detected in the CFTR gene. This results in the loss of the amino acid phenylalanine (F) at position 508, misfolding the protein and causing severe lung and digestive symptoms."
    }
  },
  {
    name: "Huntington's Disease (HTT CAG Expansion)",
    patientSeq: "ATGGCGACCCTGCAGCAGCAGCAGCAGCAGCAGCAGCAG", // Expanded
    refSeq:     "ATGGCGACCCTGCAGCAGCAGCAG", // Normal
    diagnosis: {
      title: "Diagnosis: Huntington's Disease",
      severity: "critical",
      description: "An abnormal expansion of the CAG trinucleotide repeat was detected in the HTT gene. This insertion generates a polyglutamine tract that creates a toxic mutant huntingtin protein, leading to progressive neurodegeneration."
    }
  }
];
