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
    InvalidMessage = 1,     // The provided message is malformed in some way.
    NoSuchMessage = 2,      // The message requested does not exist.
    UnauthorizedToEdit = 3, // Address is not allowed to edit this message.
    NoDonations = 4,        // Contract has no donations to claim.
}
