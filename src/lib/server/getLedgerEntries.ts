import { rpc } from '$lib/passkeyClient';
import { networks, type Message } from 'ye_olde_guestbook';
import { Address, Contract, xdr, scValToNative } from '@stellar/stellar-sdk';

interface MessageWithIndex extends Message {
    id: number;
}

export async function getMessageCount() {
    const result = await rpc.getLedgerEntries(
        new Contract(networks.testnet.contractId).getFootprint(),
    );

    const messageCount = result.entries[0].val
        .contractData()
        .val()
        .instance()
        .storage()
        ?.filter((item) => item.val().switch().name === 'scvU32');

    return messageCount![0].val().value() as number;
}

export async function getWelcomeMessage(): Promise<Message> {
    const result = await rpc.getLedgerEntries(buildMessageLedgerKey(1));
    return scValToNative(result.entries[0].val.contractData().val());
}

export async function getAllMessages(): Promise<MessageWithIndex[]> {
    const totalCount = await getMessageCount();
    const ledgerKeysArray = [];
    for (let messageId = 2; messageId <= totalCount; messageId++) {
        ledgerKeysArray.push(buildMessageLedgerKey(messageId));
    }

    const result = await rpc.getLedgerEntries(...ledgerKeysArray);
    const messages = result.entries.map((message) => {
        const key = scValToNative(message.val.contractData().key())[1]; // scVal of the key is ['Message', 2]
        const val = scValToNative(message.val.contractData().val()) as MessageWithIndex;
        val.id = key;

        return val;
    });

    return messages;
}

function buildMessageLedgerKey(messageId: number) {
    const ledgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Address(networks.testnet.contractId).toScAddress(),
            key: xdr.ScVal.scvVec([xdr.ScVal.scvSymbol('Message'), xdr.ScVal.scvU32(messageId)]),
            durability: xdr.ContractDataDurability.persistent(),
        }),
    );

    return ledgerKey;
}
