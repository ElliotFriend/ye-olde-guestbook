#![no_std]

use soroban_sdk::{
    contract, contractimpl, contractmeta, panic_with_error, Address, BytesN, Env, String,
};
use types::*;

contractmeta!(
    key = "Ye Olde Guestbook",
    val = "A smart contract guestbook. Just like in the olden days of the internet."
);

// Make sure the contract is initialized.
fn check_is_init(env: &Env) {
    if !env.storage().instance().has(&DataKey::Admin) {
        panic_with_error!(env, Error::NotInitialized);
    }
}

// Make sure the provided string is not empty.
fn check_string_not_empty(env: &Env, sus_string: &String) {
    if sus_string.is_empty() {
        panic_with_error!(env, Error::InvalidMessage);
    }
}

// Read a message from persistent storage.
fn get_message(env: &Env, message_id: u32) -> Message {
    if !env
        .storage()
        .persistent()
        .has(&DataKey::Message(message_id))
    {
        panic_with_error!(env, Error::NoSuchMessage);
    }

    let message: Message = env
        .storage()
        .persistent()
        .get(&DataKey::Message(message_id))
        .unwrap();
    return message;
}

// Write a message to persistent storage.
fn save_message(env: &Env, message: Message) -> u32 {
    let mut num_messages = env
        .storage()
        .instance()
        .get(&DataKey::MessageCount)
        .unwrap_or(0 as u32);
    num_messages += 1;

    env.storage()
        .persistent()
        .set(&DataKey::Message(num_messages), &message);
    env.storage()
        .instance()
        .set(&DataKey::MessageCount, &num_messages);

    return num_messages;
}

#[contract]
pub struct YeOldGuestbookContract;

/// A guestbook smart contract, reminiscent of the [internet
/// guestbooks](https://en.wikipedia.org/wiki/Guestbook) from the olden days.
#[contractimpl]
impl YeOldGuestbookContract {
    /// Initializes the guestbook with a warm welcome message for prospective
    /// signers to read.
    ///
    /// # Arguments
    ///
    /// * `admin` - The address which will be the owner and administrator of the
    ///   guestbook.
    /// * `title` - The title or subject of the welcome message.
    /// * `text` - The body or contents of the welcome message.
    ///
    /// # Panics
    ///
    /// * If the contract is already initialized.
    /// * If the `title` argument is empty or missing.
    /// * If the `text` argument is empty or missing.
    pub fn initialize(env: Env, admin: Address, title: String, text: String) -> Result<u32, Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        check_string_not_empty(&env, &title);
        check_string_not_empty(&env, &text);

        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);

        let first_message = Message {
            author: admin,
            ledger: env.ledger().sequence(),
            title,
            text,
        };

        let message_num = save_message(&env, first_message);
        Ok(message_num)
    }

    /// Upgrade the contract's Wasm bytecode.
    ///
    /// # Arguments
    ///
    /// * `new_wasm_hash` - Hash identifier for the bytecode that should be
    ///   henceforth used by this contract. The bytecode must already be
    ///   installed and present on-chain.
    ///
    /// # Panics
    ///
    /// * If the contract is not initialized.
    /// * If the Wasm bytecode is not already installed on-chain.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
        if !env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::NotInitialized);
        }

        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }

    /// Write a message to the guestbook.
    ///
    /// # Arguments
    ///
    /// * `author` - The sender of the message.
    /// * `title` - The title or subject of the welcome message.
    /// * `text` - The body or contents of the welcome message.
    ///
    /// # Panics
    ///
    /// * If the contract is not initialized.
    /// * If the `title` argument is empty or missing.
    /// * If the `text` argument is empty or missing.
    pub fn write_message(
        env: Env,
        author: Address,
        title: String,
        text: String,
    ) -> Result<u32, Error> {
        check_is_init(&env);
        check_string_not_empty(&env, &title);
        check_string_not_empty(&env, &text);
        author.require_auth();

        let new_message = Message {
            author,
            ledger: env.ledger().sequence(),
            title,
            text,
        };

        let message_id = save_message(&env, new_message);
        return Ok(message_id);
    }

    /// Read a specified message from the guestbook.
    ///
    /// # Arguments
    ///
    /// * `message_id` - The ID number of the message to retrieve.
    ///
    /// # Panics
    ///
    /// * If the contract is not initialized.
    /// * If the message ID is not associated with a message.
    pub fn read_message(env: Env, message_id: u32) -> Result<Message, Error> {
        check_is_init(&env);

        let message = get_message(&env, message_id);
        Ok(message)
    }

    /// Read the latest message to be sent to the guestbook.
    ///
    /// # Panics
    ///
    /// * If the contract is not initialized.
    pub fn read_latest(env: Env) -> Result<Message, Error> {
        check_is_init(&env);

        let latest_id = env
            .storage()
            .instance()
            .get(&DataKey::MessageCount)
            .unwrap();
        let latest_message = get_message(&env, latest_id);
        Ok(latest_message)
    }
}

mod test;
mod types;
