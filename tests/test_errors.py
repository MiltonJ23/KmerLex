from internal.core.domain.errors import LexicalError


def test_error_pretty_print():
    err = LexicalError(
        message="Test Message",
        line=1,
        column=5,
        char_responsable="w"
    )

    report = err.pretty_print()

    # On vérifie que la flèche est bien placée
    # "    ^" (4 espaces + flèche à la 5eme position)
    assert "    ^" in report
    assert "*** Erreur Syntaxique" in report