"""
DNA Sequence entity for genomics research
"""

class DNASequence:
    """DNA sequence from research samples"""
    
    def __init__(self, sample_id: str, sequence: str, location: str = "Yaoundé", metadata=None):
        """
        Initialize a DNA sequence
        Args:
            sample_id: Unique identifier (e.g., "YAOUNDE_001")
            sequence: DNA bases (A, C, G, T)
            location: Collection location
            metadata: Additional information
        """
        self.sample_id = sample_id
        self.sequence = sequence.upper().strip()
        self.location = location
        self.metadata = metadata or {}
    
    @property
    def length(self):
        """Get sequence length in base pairs"""
        return len(self.sequence)
    
    @property
    def gc_content(self):
        """Calculate GC percentage - important for genomics"""
        if self.length == 0:
            return 0.0
        
        g_count = self.sequence.count('G')
        c_count = self.sequence.count('C')
        return round(((g_count + c_count) / self.length) * 100, 2)
    
    def extract_kmers(self, k: int = 4):
        """
        Extract k-mers (short DNA fragments)
        Used for genome analysis and comparison
        """
        if k <= 0 or k > self.length:
            raise ValueError(f"k must be between 1 and {self.length}")
        
        kmers = []
        for i in range(self.length - k + 1):
            kmer_seq = self.sequence[i:i + k]
            kmers.append({
                'position': i,
                'sequence': kmer_seq,
                'gc_content': self._kmer_gc_content(kmer_seq)
            })
        return kmers
    
    def _kmer_gc_content(self, kmer: str):
        """Calculate GC% for a single k-mer"""
        g_count = kmer.count('G')
        c_count = kmer.count('C')
        return round(((g_count + c_count) / len(kmer)) * 100, 2)
    
    def __str__(self):
        return f"DNA[{self.sample_id}] from {self.location}: {self.length}bp, GC: {self.gc_content}%"