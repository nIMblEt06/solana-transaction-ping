import web3 = require('@solana/web3.js')
import Dotenv from 'dotenv'
const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'
Dotenv.config()

async function main() {
    const payer = initializeKeyPair();
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    // await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 1)
    await pingProgram(connection, payer)
}

// Now create an async function outside of main() called pingProgram() with two parameters requiring a connection and a payer’s keypair as arguments

async function pingProgram(connection: web3.Connection, payer: web3.Keypair) {
    const transaction = new web3.Transaction()

    const programId = new web3.PublicKey(PROGRAM_ADDRESS)
    const programDataPubKey = new web3.PublicKey(PROGRAM_DATA_ADDRESS)


    // export type TransactionInstructionCtorFields = {
    //     keys: Array<AccountMeta>;
    //     programId: PublicKey;
    //     data?: Buffer;
    //   };

    const instruction = new web3.TransactionInstruction({
        keys: [
            {
                pubkey: programDataPubKey,
                isSigner: false,
                isWritable: true
            },
        ],
        programId
    })

    transaction.add(instruction)

    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    )

    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

}

function initializeKeyPair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    return web3.Keypair.fromSecretKey(secretKey)
}

main().then(() => {
    console.log("Finished successfully");
}).catch((error) => {
    console.error(error);
})