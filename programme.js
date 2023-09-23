//import a file 
const WORDLIST = require('./utils/wordlist');
//console.log(WORDLIST);
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function createSecuredSeedPhrase() {
  // Votre code pour générer une phrase de graine sécurisée va ici
  // Assurez-vous d'importer ou d'utiliser les bibliothèques nécessaires

  // Exemple de génération de phrase aléatoire (à remplacer par votre logique réelle)
  const seedPhrase = generateRandomSeedPhrase();

  console.log('Votre phrase de graine sécurisée est :');
  console.log(seedPhrase);
}


function generateBIP39SeedPhrase() {
    // Génère un tableau d'octets (Buffer) de 16 octets
    const randomBytes = crypto.randomBytes(16);
  
    // Calcule le checksum en utilisant SHA-256
    const checksum = crypto.createHash('sha256').update(randomBytes).digest();
  
    // Obtient les 4 premiers bits du checksum
    const checksumBits = checksum.readUIntBE(0, 1) >> 4; // Lit le premier octet et décale de 4 bits vers la droite
  
    // Convertit la séquence de base en binaire
    const baseBinary = randomBytes.reduce((acc, byte) => acc + byte.toString(2).padStart(8, '0'), '');
  
    // Ajoute les 4 bits du checksum aux 124 bits de la séquence de base
    const fullBinary = baseBinary + checksumBits.toString(2).padStart(4, '0');
  
    // Divise les bits en groupes de 11 bits
    const groupSize = 11;
    const groups = [];
    for (let i = 0; i < fullBinary.length; i += groupSize) {
      groups.push(fullBinary.slice(i, i + groupSize));
    }
  
    // Calcul du nombre de mots en fonction du nombre de bits d'entropie
    const entropyBits = 124; // Utilise 124 bits pour obtenir 12 mots
    const numWords = entropyBits / 11;
  
    // Ajoute les groupes de 11 bits à la seed phrase
    const seedPhraseWords = [];
    for (let i = 0; i < groups.length; i++) {
      const binaryGroup = groups[i];
      const index = parseInt(binaryGroup, 2); // Convertit la séquence binaire en entier
      const word = WORDLIST[index];
      seedPhraseWords.push(word);
    }
  
    // Sélectionne le nombre approprié de mots pour la seed phrase (12 mots)
    const seedPhrase = seedPhraseWords.slice(0, numWords + 1).join(' ');
  
    console.log('Votre phrase de graine sécurisée est :' + seedPhrase);
  }




function menu() {
  console.log('Menu :');
  console.log('1. Créer une phrase de graine sécurisée');
  console.log('2. Importer votre seed phrase');
  console.log('3. Quitter');

  rl.question('Sélectionnez une option : ', (choice) => {
    switch (choice) {
      case '1':
        generateBIP39SeedPhrase();
        break;
      case '2':
        // Ajoutez d'autres options ici
        break;
      case '3':
        rl.close();
        break;
      default:
        console.log('Option invalide. Veuillez sélectionner une option valide.');
        menu();
        break;
    }
  });
}

// Démarrer le menu
menu();
