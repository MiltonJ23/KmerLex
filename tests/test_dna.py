"""
Test the DNA sequence class
"""

from kmerlex.core.entities.sequence import DNASequence

def test_create_dna():
    """Test creating a DNA sequence from Yaoundé"""
    # Create sample from your research
    dna = DNASequence(
        sample_id="YAOUNDE_001",
        sequence="ATCGATCGATCG",
        location="Yaoundé Central Hospital"
    )
    
    print(f"Created: {dna}")
    print(f"Length: {dna.length} base pairs")
    print(f"GC Content: {dna.gc_content}%")
    
    # Verify
    assert dna.sample_id == "YAOUNDE_001"
    assert dna.location == "Yaoundé Central Hospital"
    assert dna.length == 12
    assert dna.gc_content == 50.0  # 6 out of 12 are G or C
    
    print("✅ DNA sequence created successfully!")

def test_extract_kmers():
    """Test k-mer extraction - CORE genomics function"""
    dna = DNASequence("TEST", "ATCGATCG")
    
    # Get 4-mers
    kmers = dna.extract_kmers(k=4)
    
    print(f"\nExtracted {len(kmers)} k-mers:")
    for k in kmers:
        print(f"  Position {k['start']}: {k['kmer']} (GC: {k['gc']}%)")
    
    assert len(kmers) == 5  # 8-4+1 = 5
    assert kmers[0]['kmer'] == "ATCG"
    print("✅ K-mer extraction works!")

if __name__ == "__main__":
    # Run tests
    print("🧬 Testing Kmerlex Genomics Platform...\n")
    test_create_dna()
    test_extract_kmers()
    print("\n🎉 All tests passed! Ready for research.")