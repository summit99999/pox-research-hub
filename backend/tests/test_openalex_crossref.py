from app.services.openalex import reconstruct_abstract, normalize_doi
from app.services.crossref import clean_crossref_abstract

def test_reconstruct_abstract():
    inverted_index = {
        "Poly(2-oxazoline)": [0],
        "polymers": [1],
        "exhibit": [2],
        "tunable": [3],
        "LCST": [4],
        "behavior.": [5]
    }
    result = reconstruct_abstract(inverted_index)
    assert result == "Poly(2-oxazoline) polymers exhibit tunable LCST behavior."

def test_normalize_doi():
    cases = [
        ("https://doi.org/10.1002/anie.202301234", "10.1002/anie.202301234"),
        ("http://doi.org/10.1021/acs.macromol.2c00123/", "10.1021/acs.macromol.2c00123"),
        ("10.1016/j.eurpolymj.2021.110543", "10.1016/j.eurpolymj.2021.110543"),
        ("doi:10.1039/D1PY00543A", "10.1039/d1py00543a")
    ]
    for raw, expected in cases:
        assert normalize_doi(raw) == expected

def test_clean_crossref_abstract():
    raw_jats = "<jats:p>Cationic ring-opening polymerization of <jats:italic>2-ethyl-2-oxazoline</jats:italic> was achieved with narrow dispersity.</jats:p>"
    cleaned = clean_crossref_abstract(raw_jats)
    assert cleaned == "Cationic ring-opening polymerization of 2-ethyl-2-oxazoline was achieved with narrow dispersity."
