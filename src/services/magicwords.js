// Name and Serial Generators

const cubanWords = [
  "havana", "cigar", "rum", "mojito", "salsa", 
  "guajira", "tropicana", "malecon", "santiago", "olgin", "matanzas", "sierra",
  "cienfuegos", "guantanamo", "camaguey", "trinidad", "remedios", "holguin", "pinar",
  "varadero", "cayo", "cuba", "cuban", "cubano", "habana", "santiaguero", "santiaguera",
  "celia", "bebo", "garcia", "cruz", "cachao", "cachaito", "perez", "prado", "pacheco",
  "carnival", "son", "rumba", "clave", "afrocuban", 
  "yoruba", "santeria", "paladar", "cohiba", "bolero", 
  "platano", "tostones", "moros", "yuma", "guajiro", "guajira", "guantanamera", "guantanamo",
  "ropavieja", "congri", "mamey", "mango", "guayaba", "guava", "papaya", "pina", "pineapple",
  "guagua", "guaguanco", "carnaval", "tabaco",
  "cohiba", "montecristo", "partagas", "romeo", "julieta", "trinidad", "bolivar", "hoyo",
  "bacardi", "havana-club", "ron-santiago", "ron-mulata", "ron-cubay", "ron-cubanacan",
  "byte", "code", "data", "digital", "network",
  "logic", "processor", "cache", "binary", "algorithm",
  "bandwidth", "firewall", "interface", "kernel", "node",
  "protocol", "server", "terminal", "virus", "wireless",
  "jose-marti"
];

export const generateDeviceName = () => {
  // Randomly pick two words
  const word1 = cubanWords[Math.floor(Math.random() * cubanWords.length)];
  let word2;
  do {
      word2 = cubanWords[Math.floor(Math.random() * cubanWords.length)];
  } while (word1 === word2); // Ensure the two words are different

  return `${word1}-${word2}`; // Join with '-' and return
};

export const generateSerial = () => {
  return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
};