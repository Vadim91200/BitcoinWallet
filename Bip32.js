const crypto = require('crypto');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');
//Generate a child key of index 0
function GenerateKeys( ChainCode, data, m) {
    for (let i = 0; i < m; i++) {
        const I_child = crypto.createHmac('sha512', ChainCode).update(data).digest();
        const values = [I_child.slice(0, 32), I_child.slice(32, 64)];
        console.log(values);
        return values;
    }
}
// Assuming you have a mnemonic and want to derive a seed:

const mnemonic = new ArrayBuffer(
    "among",
    "attack",
    "any",
    "course",
    "emerge",
    "flock",
    "mirror",
    "sausage",
    "surge",
    "whip",
    "useless",
    "victory"
);
const salt = "JEZJEZJEEJJ";
const seed = crypto.pbkdf2Sync(mnemonic, salt, 2048, 64, 'sha512');

// BIP-32 Master Key Derivation
result = GenerateKeys("Bitcoin seed", seed, 0);
console.log(result);
masterPrivateKey = result[0];
masterChainCode = result[1];
console.log("Master Private Key:", masterPrivateKey.toString('hex'));
console.log("Master Chain Code:", masterChainCode.toString('hex'));
// Generate Public Key using eleptic curve
const masterPublicKey = ec.keyFromPrivate(masterPrivateKey).getPublic('hex');

console.log('Master Public Key:', masterPublicKey);

const data = Buffer.concat([Buffer.from(masterPublicKey, 'hex'), Buffer.alloc(4, 0)]);
GenerateKeys(masterChainCode, data,0)
data = Buffer.concat([Buffer.from(masterPublicKey, 'hex'), Buffer.alloc(4, 1)]);
GenerateKeys(masterChainCode, data,1)