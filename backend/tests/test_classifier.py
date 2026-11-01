from app.services.classifier import classify_paper

def test_classify_monomer_synthesis():
    title = "Synthesis of novel thiol-containing 2-oxazoline monomers for bio-click functionalization"
    abstract = "A series of 2-substituted 2-oxazoline monomers bearing pendant thioether and ester moieties were prepared."
    categories = classify_paper(title, abstract)
    slugs = [slug for slug, conf in categories]
    assert "monomer-synthesis" in slugs
    assert "functionalization" in slugs

def test_classify_pozi():
    title = "Cationic ring-opening polymerization of 2-methyl-2-oxazine: Synthesis and LCST behavior of poly(2-oxazine)"
    abstract = "Living CROP of six-membered cyclic imino ethers was investigated. The resulting poly(2-oxazine) showed sharp cloud point temperature transitions."
    categories = classify_paper(title, abstract)
    slugs = [slug for slug, conf in categories]
    assert "poly-2-oxazine" in slugs
    assert "crop-kinetics" in slugs
    assert "ucst-lcst" in slugs

def test_classify_drug_delivery_micelles():
    title = "Amphiphilic poly(2-oxazoline) block copolymer micelles for targeted paclitaxel drug delivery"
    abstract = "Poly(2-methyl-2-oxazoline)-b-poly(2-butyl-2-oxazoline) diblock copolymers were formulated into polymeric micelles with high drug loading and sustained release."
    categories = classify_paper(title, abstract)
    slugs = [slug for slug, conf in categories]
    assert "drug-delivery" in slugs
    assert "block-copolymers" in slugs
    assert "nanomaterials" in slugs

def test_classify_ros_responsive():
    title = "ROS-responsive polyoxazoline nanoparticles with oxidation-triggered drug release"
    abstract = "Thioether-functionalized poly(2-oxazoline) polymers disassembled upon exposure to reactive oxygen species like H2O2."
    categories = classify_paper(title, abstract)
    slugs = [slug for slug, conf in categories]
    assert "ros-responsive" in slugs
