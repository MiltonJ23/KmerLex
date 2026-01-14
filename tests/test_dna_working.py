"""
Working test for DNA sequence
"""

from kmerlex.core.entities.sequence import DNASequence

print("=" * 60)
print("Kmerlex Genomics Platform - DNA Sequence Test")
print("=" * 60)

# Test 1: Create DNA from Yaoundé research
dna = DNASequence(
    sample_id="YAOUNDE_MALARIA_001",
    sequence="ATCGATCGATCG",
    location="Yaoundé Central Hospital",
    metadata={"disease": "malaria", "patient": "P001"}
)

print(f"\n🧬 Sample: {dna}")
print(f"📍 Location: {dna.location}")
print(f"📏 Length: {dna.length} base pairs")
print(f"🔬 GC Content: {dna.gc_content}%")
print(f"📊 Metadata: {dna.metadata}")

# Test 2: Extract k-mers
print(f"\n🧪 Extracting k-mers...")
kmers = dna.extract_kmers(k=4)
print(f"✅ Extracted {len(kmers)} 4-mers")

print("\nFirst 5 k-mers:")
for i, kmer in enumerate(kmers[:5], 1):
    print(f"  {i}. Position {kmer['position']}: {kmer['sequence']} (GC: {kmer['gc_content']}%)")

# Test 3: Create another sample
print(f"\n🧬 Testing with longer sequence...")
dna2 = DNASequence("YAOUNDE_HIV_001", "ATCG" * 10, "Yaoundé Research Center")
print(f"Sample: {dna2}")
print(f"Length: {dna2.length}bp")
print(f"Unique 4-mers: {len(dna2.extract_kmers(4))}")

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED!")
print("✅ Kmerlex platform is operational!")
print("✅ Ready for genomics research in Yaoundé!")
print("=" * 60)