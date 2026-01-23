from internal.core.domain.errors import KmerLexError
from internal.core.domain.tokens import Token, TokenType


def test_error_pretty_print_logic():
    """Test purement visuel pour couvrir la méthode pretty_print"""
    # On simule une erreur manuellement
    err = KmerLexError(
        message="Erreur Test",
        line=1,
        column=5,
        sourceLine="Je wanda",  # Le code source
        found_token=None,
        expected_token=None
    )

    report = err.pretty_print()

    # On vérifie que le pointeur '^' est bien positionné
    # "Je wanda"
    # "    ^" (4 espaces + flèche à la 5ème colonne)
    expected_pointer = "    ^"

    assert expected_pointer in report
    assert "Je wanda" in report
    assert "Erreur Test" in report


def test_error_without_sourceline():
    """Test du cas où sourceLine est None (Sad Path)"""
    err = KmerLexError(
        message="Simple Error",
        line=1,
        column=1,
        sourceLine=None,
        found_token=None,
        expected_token=None
    )
    # Ne doit pas planter
    assert "Simple Error" in err.pretty_print()