#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    let first_id = client.initialize(&admin, &hello_world, &lorem_ipsum);
    assert_eq!(first_id, 1u32);
}

#[test]
#[should_panic(expected = "Error(Contract, #3")]
fn test_initialize_empty_title() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);
}

#[test]
#[should_panic(expected = "Error(Contract, #3")]
fn test_initialize_empty_text() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);
}

#[test]
#[should_panic(expected = "Error(Contract, #2")]
fn test_initialize_already_initialized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);
    client.initialize(&admin, &hello_world, &lorem_ipsum);
}

#[test]
fn test_write_message() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);

    let author = Address::generate(&env);
    let newer_id = client.write_message(&author, &hello_world, &lorem_ipsum);
    assert_eq!(newer_id, 2u32);
}

#[test]
#[should_panic(expected = "Error(Contract, #3")]
fn test_write_message_empty_title() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    let author = Address::generate(&env);

    client.initialize(&admin, &hello_world, &lorem_ipsum);
    client.write_message(&author, &String::from_str(&env, ""), &lorem_ipsum);
}

#[test]
#[should_panic(expected = "Error(Contract, #3")]
fn test_write_message_empty_text() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    let author = Address::generate(&env);

    client.initialize(&admin, &hello_world, &lorem_ipsum);
    client.write_message(&author, &hello_world, &String::from_str(&env, ""));
}

#[test]
#[should_panic(expected = "Error(Contract, #1")]
fn test_write_message_not_initialized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let author = Address::generate(&env);
    client.write_message(&author, &hello_world, &lorem_ipsum);
}

#[test]
fn test_read_message() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    let author = Address::generate(&env);

    client.initialize(&admin, &hello_world, &lorem_ipsum);
    client.write_message(&author, &hello_world, &lorem_ipsum);

    let first_message = client.read_message(&1u32);
    assert_eq!(first_message.ledger, 0);
    assert_eq!(first_message.author, admin);
    assert_eq!(first_message.title, hello_world);
    assert_eq!(first_message.text, lorem_ipsum);

    let second_message = client.read_message(&2u32);
    assert_eq!(second_message.ledger, 0);
    assert_eq!(second_message.author, author);
    assert_eq!(second_message.title, hello_world);
    assert_eq!(second_message.text, lorem_ipsum);
}

#[test]
#[should_panic(expected = "Error(Contract, #4")]
fn test_read_message_non_existent_id() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    let author = Address::generate(&env);

    client.initialize(&admin, &hello_world, &lorem_ipsum);
    client.write_message(&author, &hello_world, &lorem_ipsum);

    client.read_message(&3u32);
}

#[test]
#[should_panic(expected = "Error(Contract, #1")]
fn test_read_message_not_initialized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    client.read_message(&123u32);
}

#[test]
fn test_read_latest() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    let author1 = Address::generate(&env);
    let author2 = Address::generate(&env);
    let author3 = Address::generate(&env);

    client.initialize(&admin, &hello_world, &lorem_ipsum);
    client.write_message(&author1, &hello_world, &lorem_ipsum);
    client.write_message(&author2, &hello_world, &lorem_ipsum);

    let diff_title = String::from_str(&env, "A Different Title");
    let diff_text = String::from_str(&env, "A completely distinct text.");
    client.write_message(&author3, &diff_title, &diff_text);

    let latest_message = client.read_latest();
    assert_eq!(latest_message.ledger, 0);
    assert_eq!(latest_message.author, author3);
    assert_eq!(latest_message.title, diff_title);
    assert_eq!(latest_message.text, diff_text);
}

#[test]
#[should_panic(expected = "Error(Contract, #1")]
fn test_read_latest_not_initialized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    client.read_latest();
}

#[test]
fn test_edit_message() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);

    let author = Address::generate(&env);
    let message_id = client.write_message(&author, &hello_world, &lorem_ipsum);

    let new_hello_world: String = String::from_str(&env, "Updated Hello World");
    let new_lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum STILL ain't got nothin' on me!");

    client.edit_message(&message_id, &new_hello_world, &new_lorem_ipsum);
    let newly_read_message = client.read_message(&message_id);
    assert_eq!(newly_read_message.title, new_hello_world);
    assert_eq!(newly_read_message.text, new_lorem_ipsum);
}

#[test]
#[should_panic(expected = "Error(Contract, #1")]
fn test_edit_message_not_initialized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let new_hello_world: String = String::from_str(&env, "Updated Hello World");
    let new_lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum STILL ain't got nothin' on me!");

    client.edit_message(&1, &new_hello_world, &new_lorem_ipsum);
}

#[test]
#[should_panic(expected = "Error(Contract, #4")]
fn test_edit_message_bad_message_id() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);

    let author = Address::generate(&env);
    let message_id = client.write_message(&author, &hello_world, &lorem_ipsum);

    let new_hello_world: String = String::from_str(&env, "Updated Hello World");
    let new_lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum STILL ain't got nothin' on me!");

    client.edit_message(&(message_id + 1), &new_hello_world, &new_lorem_ipsum);
}

#[test]
fn test_edit_message_empty_title() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);

    let author = Address::generate(&env);
    let message_id = client.write_message(&author, &hello_world, &lorem_ipsum);

    let new_lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum STILL ain't got nothin' on me!");

    client.edit_message(&message_id, &String::from_str(&env, ""), &new_lorem_ipsum);
    let edited_message = client.read_message(&message_id);
    assert_eq!(edited_message.title, hello_world);
    assert_eq!(edited_message.text, new_lorem_ipsum);
}

#[test]
fn test_edit_message_empty_text() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);

    let author = Address::generate(&env);
    let message_id = client.write_message(&author, &hello_world, &lorem_ipsum);

    let new_hello_world: String = String::from_str(&env, "Updated Hello World");

    client.edit_message(&message_id, &new_hello_world, &String::from_str(&env, ""));
    let edited_message = client.read_message(&message_id);
    assert_eq!(edited_message.title, new_hello_world);
    assert_eq!(edited_message.text, lorem_ipsum);
}

#[test]
#[should_panic(expected = "Error(Contract, #3")]
fn test_edit_message_empty_title_and_text() {
    let env = Env::default();
    let contract_id = env.register_contract(None, YeOldGuestbookContract);
    let client = YeOldGuestbookContractClient::new(&env, &contract_id);

    let hello_world: String = String::from_str(&env, "Hello World");
    let lorem_ipsum: String = String::from_str(&env, "Lorem Ipsum ain't got nothin' on me!");

    env.mock_all_auths();

    let admin = Address::generate(&env);
    client.initialize(&admin, &hello_world, &lorem_ipsum);

    let author = Address::generate(&env);
    let message_id = client.write_message(&author, &hello_world, &lorem_ipsum);

    client.edit_message(&message_id, &String::from_str(&env, ""), &String::from_str(&env, ""));
}
