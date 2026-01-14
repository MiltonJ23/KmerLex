@echo off
echo ============================================
echo  Kmerlex Genomics Platform - Yaounde Research
echo ============================================
echo.

if "%1"=="test" (
    echo Running DNA tests...
    python tests/test_dna_working.py
    goto :end
)

if "%1"=="web" (
    echo Starting web server...
    cd web\backend
    python app.py
    goto :end
)

if "%1"=="analyze" (
    if "%2"=="" (
        echo Usage: run.bat analyze ATCGATCG
        goto :end
    )
    echo Analyzing DNA sequence: %2
    python -c "from kmerlex.core.entities.sequence import DNASequence; d=DNASequence('CMD_TEST', '%2'); print(f'[RESULT] Length: {d.length}bp, GC%%: {d.gc_content}%%, 4-mers: {len(d.extract_kmers(4))}')"
    goto :end
)

if "%1"=="api-test" (
    echo Testing API with sample DNA...
    curl -X POST http://localhost:5000/api/analyze ^
    -H "Content-Type: application/json" ^
    -d "{\"sample_id\": \"BATCH_TEST\", \"sequence\": \"ATCGATCGATCG\", \"location\": \"Yaoundé Lab\"}"
    goto :end
)

echo Available commands:
echo   run.bat test              - Run DNA tests
echo   run.bat web               - Start web server
echo   run.bat analyze ATCGATCG  - Analyze DNA sequence
echo   run.bat api-test          - Test API (requires web server running)
echo.
echo Example: run.bat analyze ATCGATCGATCG
echo Example: run.bat test

:end