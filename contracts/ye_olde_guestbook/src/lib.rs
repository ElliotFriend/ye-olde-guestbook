#![no_std]

use soroban_sdk::{
    contract, contractimpl, contractmeta, panic_with_error, token, Address, BytesN, Env, String,
};
use types::*;

contractmeta!(
    key = "Ye Olde Guestbook",
    val = "A smart contract guestbook. Just like in the olden days of the internet."
);

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
    /// * If the `title` argument is empty or missing.
    /// * If the `text` argument is empty or missing.
    pub fn __constructor(
        env: Env,
        admin: Address,
        title: String,
        text: String,
    ) -> Result<(), Error> {
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

        save_message(&env, first_message);
        Ok(())
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
    /// * If the Wasm bytecode is not already installed on-chain.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
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
    /// * `title` - The title or subject of the guestbook message.
    /// * `text` - The body or contents of the guestbook message.
    ///
    /// # Panics
    ///
    /// * If the `title` argument is empty or missing.
    /// * If the `text` argument is empty or missing.
    pub fn write_message(
        env: Env,
        author: Address,
        title: String,
        text: String,
    ) -> Result<u32, Error> {
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

    /// Edit a specified message in the guestbook.
    ///
    /// # Arguments
    ///
    /// * `message_id` - The ID number of the message to edit.
    /// * `title` - The title or subject of the guestbook message.
    /// * `text` - The body or contents of the guestbook message.
    ///
    /// # Panics
    ///
    /// * If the contract is not initialized.
    /// * If both the `title` AND `text` arguments are empty or missing.
    /// * If there is no authorization from the original message author.
    pub fn edit_message(
        env: Env,
        message_id: u32,
        title: String,
        text: String,
    ) -> Result<(), Error> {
        if title.is_empty() {
            check_string_not_empty(&env, &text);
        }

        if text.is_empty() {
            check_string_not_empty(&env, &title);
        }

        let mut message = get_message(&env, message_id);
        message.author.require_auth();

        let edited_title = if title.is_empty() {
            message.title
        } else {
            title
        };
        let edited_text = if text.is_empty() { message.text } else { text };

        message.title = edited_title;
        message.text = edited_text;
        message.ledger = env.ledger().sequence();

        env.storage()
            .persistent()
            .set(&DataKey::Message(message_id), &message);
        return Ok(());
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
        let message = get_message(&env, message_id);
        Ok(message)
    }

    /// Read the latest message to be sent to the guestbook.
    ///
    /// # Panics
    ///
    /// * If the contract is not initialized.
    pub fn read_latest(env: Env) -> Result<Message, Error> {
        let latest_id = env
            .storage()
            .instance()
            .get(&DataKey::MessageCount)
            .unwrap();
        let latest_message = get_message(&env, latest_id);
        Ok(latest_message)
    }

    /// Claim any donations that have been made to the guestbook contract.
    ///
    /// # Panics
    ///
    /// * If the contract is not initialized.
    /// * If the contract is not holding any donations balance.
    pub fn claim_donations(env: Env, token: Address) -> Result<i128, Error> {
        let token_client = token::TokenClient::new(&env, &token);
        let contract_balance = token_client.balance(&env.current_contract_address());

        if contract_balance == 0 {
            panic_with_error!(&env, Error::NoDonations);
        }

        let admin_address: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        token_client.transfer(
            &env.current_contract_address(),
            &admin_address,
            &contract_balance,
        );

        Ok(contract_balance)
    }
}

mod test;
mod types;
