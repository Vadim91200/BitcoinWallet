# BitcoinWallet

# BIP-32 Key Derivation in JavaScript

This project demonstrates the process of deriving child keys from a mnemonic seed using BIP-32 key derivation in JavaScript.

## **Table of Contents**
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Disclaimer](#disclaimer)
- [License](#license)

## Requirements

- Node.js
- `elliptic` library for ECDSA operations.
- `crypto` (built-in with Node.js) for cryptographic operations.

## Installation

1. **Clone this repository:**
```bash
   git clone <repository-url>
```
2. **Navigate to the project directory:**
```bash
   cd <project-directory>
```
3. **Install the necessary package:**
```bash
   npm install elliptic
```

## Usage

1.**Specify Indices:**
To derive a child key at a specific index and level, adjust the M and N indices in the script.

2.**Run the script**:
```bash
   node <script-name>.js
```

## Features
* Derives the master private key and chain code from a mnemonic seed.
* Computes the master public key from the master private key.
* Derives child private keys at specified indices and levels.

## Disclaimer
This project is for educational purposes only. Always ensure to understand the derivation process fully and test your implementation thoroughly before considering it for any serious or production use. Never expose private keys, especially on the internet, and always prioritize security when working with cryptographic keys.

## License
MIT

Made by:
Mathis Keraval
Charles-André GOICHOT
Nicolas Matzuzac