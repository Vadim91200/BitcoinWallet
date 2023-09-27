use rand::prelude::*;
use bip39::Language;
use sha2::{Digest, Sha256};

fn main() {
    let pass_key = generate_seed();
    let seed = seed_from_words(pass_key);
    println!("{seed}");
}

fn generate_seed() -> Vec<&'static str> {
    let mut rng = rand::thread_rng();
    let seed: u128 = rng.gen();
    println!("{seed}");
    let seed_bytes = seed.to_be_bytes();
    let mut hasher = Sha256::new();
    hasher.update(&seed_bytes);
    let result = hasher.finalize();
    let result_bytes: [u8; 32] = result.into();
    let four_most_significant_bits = result_bytes[0] >> 4;
    
    let mut binary_seed = Vec::new();
    for i in (0..128).rev() {
        let bit = (seed >> i) & 1;
        binary_seed.push(bit as u8);
    }

    let mut eleven_bit_chunks = Vec::new();
    let mut chunk = 0u16;
    let mut count = 0;
    for bit in &binary_seed {
        chunk = (chunk << 1) | (*bit as u16);
        count += 1;
        if count == 11 {
            eleven_bit_chunks.push(chunk);
            chunk = 0;
            count = 0;
        }
    }
    eleven_bit_chunks.push((chunk << 4) | four_most_significant_bits as u16);
    let language = Language::English;
    let word_list = language.word_list();

    let mut pass_key = Vec::new();
    for index in &eleven_bit_chunks {
        let word = word_list[*index as usize];
        pass_key.push(word);
    }
    pass_key
}

fn seed_from_words(words: Vec<&str>) -> u128 {
    let language = Language::English;
    let mut eleven_bit_chunks = Vec::new();
    for word in words {
        eleven_bit_chunks.push(language.find_word(word).unwrap());
    }

    eleven_bit_chunks[11] = eleven_bit_chunks[11]  >> 4;

    let mut binary_seed = Vec::new();
    let last_one = eleven_bit_chunks.pop().unwrap();
    let mask: u16 = 1;
    for i in 0..7 {
        let bit = if last_one & (mask << i ) != 0 { 1 } else { 0 };
        binary_seed.push(bit);
    }
    for chunks in eleven_bit_chunks.iter().rev() {
        for i in 0..11 {
            let bit = if chunks & (mask << i ) != 0 { 1 } else { 0 };
            binary_seed.push(bit as u8);
        }
    }
    binary_seed.reverse();

    let mut seed: u128 = 0;
    for bit in binary_seed {
        seed = (seed << 1) | u128::from(bit);
    }
    seed
}

