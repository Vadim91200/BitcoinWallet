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
    //random u16 integer
    const randomBytes = crypto.randomBytes(16);
    console.log('This is the HEX version of the seed : '+ randomBytes.toString('hex'));
    //convert to binary
    const binaryString = randomBytes.reduce((acc, byte) => acc + byte.toString(2).padStart(8, '0'), '');
    console.log('This is the binary version of the seed : '+ binaryString);

    console.log('Bytes in hexadecimal:');
    for (let i = 0; i < randomBytes.length; i++) {
      console.log('Byte ' + i + ': ' + randomBytes[i].toString(16).padStart(2, '0'));
    }

    const groupSize = 11;
    const groups = [];
    for (let i = 0; i < binaryString.length; i += groupSize) {
      groups.push(binaryString.slice(i, i + groupSize));
    }

    console.log('Groups of 11 bits:');
    for (let i = 0; i < groups.length; i++) {
      console.log('Group ' + i + ': ' + groups[i]);
    }

    for (let i = 0; i < groups.length; i++) {
        const binaryGroup = groups[i];
        const index = parseInt(binaryGroup, 2); // Convertit la séquence binaire en entier
        const associatedWord = WORDLIST[index];
        console.log('Group ' + i + ': ' + binaryGroup + ' -> ' + associatedWord);
      }




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
