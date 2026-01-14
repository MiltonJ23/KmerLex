"""
Kmerlex Web Server - Genomics Platform for Yaoundé Research
"""

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    """Welcome page"""
    return jsonify({
        "project": "Kmerlex Genomics Platform",
        "version": "0.1.0",
        "institution": "University of Yaoundé",
        "location": "Yaoundé, Cameroon",
        "description": "DNA sequence analysis platform for African genomics research",
        "endpoints": {
            "GET /": "This information",
            "GET /api/health": "System health check",
            "POST /api/analyze": "Analyze DNA sequence",
            "GET /api/example": "Example analysis"
        }
    })

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "kmerlex",
        "version": "0.1.0",
        "message": "Platform ready for research"
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze a DNA sequence"""
    try:
        # Get JSON data
        data = request.json
        
        # Import DNA class
        from kmerlex.core.entities.sequence import DNASequence
        
        # Create DNA object
        dna = DNASequence(
            sample_id=data.get('sample_id', 'UNKNOWN_SAMPLE'),
            sequence=data.get('sequence', ''),
            location=data.get('location', 'Yaoundé'),
            metadata=data.get('metadata', {})
        )
        
        # Extract k-mers
        kmers_4 = dna.extract_kmers(k=4)
        kmers_6 = dna.extract_kmers(k=6)
        
        # Prepare response
        response = {
            "analysis_id": f"analysis_{dna.sample_id}",
            "sample_info": {
                "sample_id": dna.sample_id,
                "location": dna.location
            },
            "sequence_analysis": {
                "length": dna.length,
                "gc_content": dna.gc_content,
                "base_composition": {
                    "A": dna.sequence.count('A'),
                    "T": dna.sequence.count('T'),
                    "C": dna.sequence.count('C'),
                    "G": dna.sequence.count('G')
                }
            },
            "kmer_analysis": {
                "total_4_mers": len(kmers_4),
                "total_6_mers": len(kmers_6),
                "example_4_mers": [k['sequence'] for k in kmers_4[:5]]
            },
            "metadata": dna.metadata,
            "status": "analysis_complete"
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "analysis_failed"
        }), 400

@app.route('/api/example')
def example():
    """Example analysis"""
    from kmerlex.core.entities.sequence import DNASequence
    
    # Example DNA from malaria research
    dna = DNASequence(
        sample_id="EXAMPLE_MALARIA",
        sequence="ATCGATCGATCGATCGATCG",
        location="Yaoundé Research Lab",
        metadata={"organism": "Plasmodium falciparum", "study": "Malaria genomics"}
    )
    
    kmers = dna.extract_kmers(k=4)
    
    return jsonify({
        "example": "Malaria parasite DNA sequence",
        "sample": str(dna),
        "analysis": {
            "gc_content": dna.gc_content,
            "kmer_count": len(kmers),
            "first_kmers": [k['sequence'] for k in kmers[:3]]
        }
    })

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🌍 Kmerlex Genomics Platform - Web Server")
    print("📍 University of Yaoundé, Cameroon")
    print("=" * 60)
    print("\n📡 Starting server...")
    print("🌐 Open: http://localhost:5000")
    print("🔬 API: http://localhost:5000/api/analyze")
    print("\nExample API call:")
    print('''
    curl -X POST http://localhost:5000/api/analyze \\
    -H "Content-Type: application/json" \\
    -d '{
        "sample_id": "YAOUNDE_TEST",
        "sequence": "ATCGATCGATCGATCG",
        "location": "Yaoundé Central Hospital",
        "metadata": {"study": "test", "researcher": "Yves"}
    }'
    ''')
    print("\n" + "=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)