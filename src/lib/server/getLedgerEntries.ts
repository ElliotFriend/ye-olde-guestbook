import { PUBLIC_STELLAR_RPC_URL } from '$env/static/public';
import {
    rpc,
    Address,
    networks,
    Contract,
    type Message,
    xdr,
    scValToNative,
} from 'ye_olde_guestbook';

const server = new rpc.Server(PUBLIC_STELLAR_RPC_URL);

export async function getMessageCount() {
    const result = await server.getLedgerEntries(
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

export async function getAllMessages(totalCount: number): Promise<Message[]> {
    const ledgerKeysArray = [];
    for (let messageId = 1; messageId <= totalCount; messageId++) {
        ledgerKeysArray.push(buildMessageLedgerKey(messageId));
    }

    const result = await server.getLedgerEntries(...ledgerKeysArray);
    const messages = result.entries.map((message) => {
        return {
            ...scValToNative(message.val.contractData().val()),
        };
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
