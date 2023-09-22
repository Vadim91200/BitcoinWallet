use rand::prelude::*;
use bip39::Language;

fn main() {
    let pass_key = generate_key();
    println!("{pass_key:?}");
}


fn generate_key() -> Vec<&'static  str>{
    let mut rng = rand::thread_rng();
    let random_bytes: [u8; 16] = rng.gen();

    let hex_string: String = random_bytes
        .iter()
        .map(|byte| format!("{:02X}", byte))
        .collect();
    println!("{hex_string:?}");

    // Convertir la seed en binaire
    let mut binary_seed = Vec::new();
    for byte in &random_bytes {
        let mut mask = 0b10000000;
        for _ in 0..8 {
            let bit = if byte & mask != 0 { 1 } else { 0 };
            binary_seed.push(bit);
            mask >>= 1;
        }
    }
    // Découper la seed en lots de 11 bits
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
    eleven_bit_chunks.push(chunk);

    // Afficher les mots correspondants à chaque index dans eleven_bit_chunks
    let language = Language::English;
    let word_list = language.word_list();

    let mut pass_key = Vec::new();
    for index in &eleven_bit_chunks {
        let word = word_list[*index as usize];
        pass_key.push(word);
    }
    pass_key
}

fn import_key(pass_key: Vec<&str>) -> String {
    let mut rng = rand::thread_rng();
    let random_bytes: [u8; 16] = rng.gen();


    let hex_string: String = random_bytes
        .iter()
        .map(|byte| format!("{:02X}", byte))
        .collect();


    hex_string
}

