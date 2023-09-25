//import a file 
const WORDLIST = require('./utils/wordlist');
//console.log(WORDLIST);
const readline = require('readline');
const crypto = require('crypto');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function generateBIP39SeedPhrase() {
    // Generate a Bytes Array (Buffer) of 16 bytes
    const randomBytes = crypto.randomBytes(16);

    // Calculate the checksum using SHA-256
    const checksum = crypto.createHash('sha256').update(randomBytes).digest();

    // Get the first 4 bits of the checksum
    const checksumBits = checksum.readUIntBE(0, 1) >> 4; // Lit le premier octet et décale de 4 bits vers la droite

    // Convert the sequence in binary
    const baseBinary = randomBytes.reduce((acc, byte) => acc + byte.toString(2).padStart(8, '0'), '');

    // Add the 4 bits of the checksum to the 124 bits of the base sequence
    const fullBinary = baseBinary + checksumBits.toString(2).padStart(4, '0');

    // Divide the bits enin groups of 11 bits
    const groupSize = 11;
    const groups = [];
    for (let i = 0; i < fullBinary.length; i += groupSize) {
        groups.push(fullBinary.slice(i, i + groupSize));
    }

    // Calculate the number of words as a function of the number of entropy bits
    const entropyBits = 124; // use 124 bits to obtains 12 words
    const numWords = entropyBits / 11;

    // Add the groups of 11 bits to the seed phrase
    const seedPhraseWords = [];
    for (let i = 0; i < groups.length; i++) {
        const binaryGroup = groups[i];
        const index = parseInt(binaryGroup, 2); // Convert the binary sequence to integer
        const word = WORDLIST[index];
        seedPhraseWords.push(word);
    }

    // Select the appropriate number of words for the seed phrase (12 words)
    const seedPhrase = seedPhraseWords.slice(0, numWords + 1).join(' ');

    console.log('Votre phrase de graine sécurisée est : ' + seedPhrase);
    return seedPhrase;
}

function verifySeedPhrase(seedPhrase) {
    let isValid = false;

    // Separate the seed phrase into words
    const words = seedPhrase.split(' ');

    // Check that the seed phrase contains the correct number of words (12, 15, 18, 21 or 24).
    if ([12, 15, 18, 21, 24].indexOf(words.length) === -1) {
        return isValid;
    }

    // Gets the last word of the seed phrase
    const lastWord = words[words.length - 1];

    // Checks that the last word is from the BIP-39 list
    if (WORDLIST.indexOf(lastWord) === -1) {
        return isValid;
    }

    // Recovers the binary checksum of the last word
    const checksumBits = lastWord.slice(-1).charCodeAt(0).toString(2).padStart(4, '0');

    // Calculation of the binary checksum of the preceding words
    const calculatedChecksum = crypto.createHash('sha256')
        .update(words.slice(0, -1).join(' '))
        .digest()
        .toString('hex')
        .slice(0, 1); // Takes the first hexadecimal character (4 bits) of the SHA-256 hash

    console.log('Checksum binaire extrait : ' + checksumBits);
    console.log('Checksum binaire calculé : ' + calculatedChecksum);

    // Compares the extracted checksum with the calculated checksum
    isValid = checksumBits === calculatedChecksum;

    return { isValid, checksumBits };
}
function GenerateKeys(ChainCode, data, m) {
    // While the derivation level is not equal th i level m 
    for (let i = 0; i < m; i++) {
        const keys = crypto.createHmac('sha512', ChainCode).update(data).digest(); // todo
        const generatedResult = [keys.slice(0, 32), keys.slice(32, 64)] 
        console.log("Private Key:", generatedResult[0].toString('hex'));
        console.log("Chain Code:", generatedResult[1].toString('hex'));
        return generatedResult;
    }
}
function ExtractPrivateKeyAndChainCode(mnemonic) {
    const seed = crypto.pbkdf2Sync(mnemonic, "ffff", 2048, 64, 'sha512'); // Create the seed for the parent
    return GenerateKeys("Bitcoin seed", seed, 1); // Generate Keys
}
function ExtractPublicKey(Keys) {
    const masterPublicKey = ec.keyFromPrivate(Keys[0]).getPublic('hex'); // Generate Public Key using eleptic curve
    console.log('Master Public Key:', masterPublicKey);
    return [masterPublicKey, Keys[1]];
}
function GenerateChildKey(element) {
    rl.question('Enter the index: ', async (index) => {
        rl.question('Enter the derivation level: ', async (derivationLevel) => {
            GenerateKeys(element[1], Buffer.concat([Buffer.from(element[0], 'hex'), Buffer.alloc(4, index)]), derivationLevel);
            menu(); // Call back the menu
        });
    });
}
function menu() {
    console.log('Menu :');
    console.log('1. Créer une phrase de graine sécurisée');
    console.log('2. Importer votre seed phrase');
    console.log('3. Quitter');

    rl.question('Sélectionnez une option : ', (choice) => {
        switch (choice) {
            case '1':
                Bip32(generateBIP39SeedPhrase());
                break;
            case '2':
                // wait for seed phrase input
                rl.question('Entrez votre phrase de graine sécurisée : ', (seedPhrase) => {
                    const isValid = verifySeedPhrase(seedPhrase);
                    if (isValid) {
                        console.log('Votre phrase de graine sécurisée est valide !');
                    } else {
                        console.log('Votre phrase de graine sécurisée est invalide !');
                        menu();
                    }
                    Bip32(seedPhrase)
                });
                break;
            case '3':
                rl.close();
                break;
            default:
                console.log('Option invalide. Veuillez sélectionner une option valide.');
                menu(); // Call back the menu when the choice is invalid
                break;
        }
    });
}
function Bip32(Mnemonic) {
    console.log(' a. Extract the master private key and the chain code');
    console.log(' b. Generate a child key');
    console.log(' c. Quit');

    rl.question('Select an option : ', (newChoice) => {
        switch (newChoice) {
            case 'a':
                ExtractPublicKey(ExtractPrivateKeyAndChainCode(Mnemonic));
                menu(); // Call back the menu
                break;
            case 'b':
                GenerateChildKey(ExtractPublicKey(ExtractPrivateKeyAndChainCode(Mnemonic)));      
                break;
            case 'c':
                rl.close();
                break;
            default:
                console.log('Option invalide. Veuillez sélectionner une option valide.');
                menu(); // Call back the menu when the choice is invalid
                break;
        }
    });
}
menu();
