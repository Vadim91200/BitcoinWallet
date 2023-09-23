//import a file 
const WORDLIST = require('./utils/wordlist');
//console.log(WORDLIST);
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


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
  
    console.log('Votre phrase de graine sécurisée est : ' + seedPhrase);
  }

  function verifySeedPhrase(seedPhrase) {
    let isValid = false;
  
    // Sépare la seed phrase en mots
    const words = seedPhrase.split(' ');
  
    // Vérifie que la seed phrase contient le nombre correct de mots (12, 15, 18, 21 ou 24)
    if ([12, 15, 18, 21, 24].indexOf(words.length) === -1) {
      return isValid;
    }
  
    // Obtient le dernier mot de la seed phrase
    const lastWord = words[words.length - 1];
  
    // Vérifie que le dernier mot est issu de la liste BIP-39
    if (WORDLIST.indexOf(lastWord) === -1) {
      return isValid;
    }
  
    // Récupère le checksum binaire du dernier mot
    const checksumBits = lastWord.slice(-1).charCodeAt(0).toString(2).padStart(4, '0');
  
    // Calcul du checksum binaire des mots précédents
    const calculatedChecksum = crypto.createHash('sha256')
      .update(words.slice(0, -1).join(' '))
      .digest()
      .toString('hex')
      .slice(0, 1); // Prend le premier caractère hexadécimal (4 bits) du hachage SHA-256

    console.log('Checksum binaire extrait : ' + checksumBits);
    console.log('Checksum binaire calculé : ' + calculatedChecksum);
  
    // Compare le checksum extrait avec le checksum calculé
    isValid = checksumBits === calculatedChecksum;
  
    return { isValid, checksumBits };
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
        // wait for seed phrase input
        rl.question('Entrez votre phrase de graine sécurisée : ', (seedPhrase) => {
          const isValid = verifySeedPhrase(seedPhrase);
          if (isValid) {
            console.log('Votre phrase de graine sécurisée est valide !');
            rl.close();
          } else {
            console.log('Votre phrase de graine sécurisée est invalide !');
            rl.close();
          }
        });
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
