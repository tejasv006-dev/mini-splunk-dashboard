/**
 * Analyzes the Smith-Waterman traceback path to identify specific mutations.
 * @param {Array} paths - Array of [i, j] coordinate pairs from the traceback.
 * @param {string[]} seq1 - Patient sequence as an array.
 * @param {string[]} seq2 - Reference sequence as an array.
 * @returns {Object} { alignedSeq1, alignedSeq2, mutations }
 */
export const analyzeMutations = (paths, seq1, seq2) => {
  if (!paths || paths.length < 2) return { alignedSeq1: '', alignedSeq2: '', mutations: [] };

  const mutations = [];
  let aligned1 = [];
  let aligned2 = [];
  
  // paths is from end to start (traceback), so we reverse to read from start to end of alignment
  const sortedPaths = [...paths].reverse();
  
  for (let k = 0; k < sortedPaths.length - 1; k++) {
    const [i1, j1] = sortedPaths[k];
    const [i2, j2] = sortedPaths[k + 1];
    
    const char1 = seq1[i2 - 1];
    const char2 = seq2[j2 - 1];
    
    if (i2 === i1 + 1 && j2 === j1 + 1) {
      // Diagonal Move: Match or Substitution
      aligned1.push(char1);
      aligned2.push(char2);
      
      if (char1 !== char2) {
        mutations.push({
          type: 'Substitution',
          pos: j2, // Reference position
          ref: char2,
          alt: char1,
          description: `Base ${char2} substituted by ${char1}`
        });
      }
    } else if (i2 === i1 + 1) {
      // Vertical Move: Deletion from Reference / Insertion in Patient
      aligned1.push(char1);
      aligned2.push('-');
      mutations.push({
        type: 'Insertion',
        pos: j1,
        ref: '-',
        alt: char1,
        description: `Extra base ${char1} inserted after position ${j1}`
      });
    } else if (j2 === j1 + 1) {
      // Horizontal Move: Deletion in Patient
      aligned1.push('-');
      aligned2.push(char2);
      mutations.push({
        type: 'Deletion',
        pos: j2,
        ref: char2,
        alt: '-',
        description: `Base ${char2} deleted at position ${j2}`
      });
    }
  }

  return {
    alignedSeq1: aligned1.join(''),
    alignedSeq2: aligned2.join(''),
    mutations
  };
};
