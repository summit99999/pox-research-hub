/**
 * Polymer Research Intelligence Hub (PRIH)
 * Coordinated Category Plate and Visual Treatment Mapping System
 * 
 * Maps categories, polymer families, and research domains to their distinct
 * light-gradient plate styling and card accent styles without printing color names.
 */

export function getCategoryPlateClass(name = '') {
  const n = String(name).toLowerCase();
  
  if (n.includes('oxazoline') || n.includes('oxazine') || n.includes('pox') || n.includes('pozi') || n.includes('crop')) {
    return 'cat-plate-pox';
  }
  if (n.includes('polyolefin') || n.includes('olefin') || n.includes('polyethylene') || n.includes('polypropylene')) {
    return 'cat-plate-polyolefins';
  }
  if (n.includes('polyester') || n.includes('pla') || n.includes('pcl') || n.includes('biodegradable')) {
    return 'cat-plate-polyesters';
  }
  if (n.includes('polyamide') || n.includes('nylon') || n.includes('peptoid') || n.includes('polypeptide')) {
    return 'cat-plate-polyamides';
  }
  if (n.includes('polyether') || n.includes('peg') || n.includes('glycol') || n.includes('peo')) {
    return 'cat-plate-polyethers';
  }
  if (n.includes('conducting') || n.includes('conjugated') || n.includes('pedot') || n.includes('electronic')) {
    return 'cat-plate-conducting';
  }
  if (n.includes('biopolymer') || n.includes('cellulose') || n.includes('chitosan') || n.includes('alginate') || n.includes('natural')) {
    return 'cat-plate-biopolymers';
  }
  if (n.includes('responsive') || n.includes('smart') || n.includes('stimuli') || n.includes('lcst') || n.includes('actuator')) {
    return 'cat-plate-responsive';
  }
  if (n.includes('method') || n.includes('atrp') || n.includes('raft') || n.includes('rop') || n.includes('radical') || n.includes('cataly')) {
    return 'cat-plate-methods';
  }
  if (n.includes('characterization') || n.includes('sec') || n.includes('gpc') || n.includes('nmr') || n.includes('rheology') || n.includes('physics')) {
    return 'cat-plate-characterization';
  }
  if (n.includes('biomedical') || n.includes('delivery') || n.includes('therapeutic') || n.includes('tissue') || n.includes('scaffold')) {
    return 'cat-plate-biomedical';
  }
  if (n.includes('sustainab') || n.includes('recycl') || n.includes('circular') || n.includes('green')) {
    return 'cat-plate-sustainability';
  }
  if (n.includes('advanced') || n.includes('nanotech') || n.includes('membrane') || n.includes('battery') || n.includes('composite')) {
    return 'cat-plate-advanced';
  }

  // Fallbacks based on string hash for consistent diversity
  const fallbacks = [
    'cat-plate-pox',
    'cat-plate-polyolefins',
    'cat-plate-polyesters',
    'cat-plate-polyethers',
    'cat-plate-responsive',
    'cat-plate-methods',
    'cat-plate-biomedical',
    'cat-plate-advanced'
  ];
  let hash = 0;
  for (let i = 0; i < n.length; i++) hash = (hash << 5) - hash + n.charCodeAt(i);
  return fallbacks[Math.abs(hash) % fallbacks.length];
}

export function getArticleAccentClass(name = '') {
  const n = String(name).toLowerCase();
  
  if (n.includes('oxazoline') || n.includes('oxazine') || n.includes('pox') || n.includes('responsive')) {
    return 'article-accent-purple';
  }
  if (n.includes('polyolefin') || n.includes('characterization')) {
    return 'article-accent-indigo';
  }
  if (n.includes('polyester') || n.includes('biopolymer') || n.includes('sustainab')) {
    return 'article-accent-emerald';
  }
  if (n.includes('polyamide') || n.includes('biomedical')) {
    return 'article-accent-rose';
  }
  if (n.includes('polyether') || n.includes('crop') || n.includes('ring-opening')) {
    return 'article-accent-teal';
  }
  if (n.includes('conducting') || n.includes('advanced')) {
    return 'article-accent-cyan';
  }
  if (n.includes('method') || n.includes('radical') || n.includes('atrp')) {
    return 'article-accent-amber';
  }

  return 'article-accent-teal';
}
