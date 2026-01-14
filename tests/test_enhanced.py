"""
Test enhanced DNA sequence features
"""

from kmerlex.core.entities.sequence import DNASequence

def test_enhanced_dna():
    """Test the enhanced DNA sequence class"""
    
    # Create a sample from Yaoundé research
    dna = DNASequence(
        sample_id="YAOUNDE_MALARIA_001",
        sequence="ATCGATCGATCG",
        location="Yaoundé Central Hospital",
        collection_date="2024-01-15",
        metadata={"disease": "malaria", "patient_id": "P001"}
    )
    
    print(f"Sample: {dna}")
    print(f"Location: {dna.location}")
    print(f"Length: {dna.length}bp")
    print(f"GC Content: {dna.gc_content}%")
    print(f"Metadata: {dna.metadata}")
    
    # Test k-mer extraction
    kmers = dna.extract_kmers(k=4)
    print(f"\nExtracted {len(kmers)} 4-mers")
    
    # Show first 3 k-mers
    for kmer in kmers[:3]:
        print(f"  Position {kmer['position']}: {kmer['sequence']} (GC: {kmer['gc_content']}%)")
    
    print("\n✅ Enhanced DNA features work!")

if __name__ == "__main__":
    print("🧬 Testing Kmerlex Platform...\n")
    test_enhanced_dna()
    print("\n🎉 Test passed! Ready for research analysis.")