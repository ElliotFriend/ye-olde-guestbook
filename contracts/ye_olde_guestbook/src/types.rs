use soroban_sdk::{contracterror, contracttype, Address, String};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    MessageCount,
    Message(u32),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Message {
    pub author: Address,
    pub ledger: u32,
    pub title: String,
    pub text: String,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,     // Contract has not been initialized yet.
    AlreadyInitialized = 2, // Contract has already been initialized.
    InvalidMessage = 3,     // The provided message is malformed in some way.
    NoSuchMessage = 4,      // The message requested does not exist.
    UnauthorizedToEdit = 5, // Address is not allowed to edit this message.
    NoDonations = 6,        // Contract has no donations to claim.
}
