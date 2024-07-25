#![no_std]

use soroban_sdk::{
    contract, contractimpl, contractmeta, panic_with_error, Address, BytesN, Env, String,
};
use types::*;

contractmeta!(
    key = "Ye Olde Guestbook",
    val = "A smart contract guestbook. Just like in the olden days of the internet."
);

fn check_is_init(env: &Env) {
    if !env.storage().instance().has(&DataKey::Admin) {
        panic_with_error!(env, Error::NotInitialized);
    }
}

fn check_string_not_empty(env: &Env, sus_string: &String) {
    if sus_string.is_empty() {
        panic_with_error!(env, Error::InvalidMessage);
    }
}

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

#[contractimpl]
impl YeOldGuestbookContract {
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

    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
        if !env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::NotInitialized);
        }

        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }

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

    pub fn read_message(env: Env, message_id: u32) -> Result<Message, Error> {
        check_is_init(&env);

        let message = get_message(&env, message_id);
        Ok(message)
    }

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
