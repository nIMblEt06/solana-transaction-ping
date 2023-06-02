import * as web3 from '@solana/web3.js'
import Dotenv from 'dotenv'
Dotenv.config()

async function main() {
    const payer = initializeKeyPair();
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 1)
    await sendSol(connection, payer, 0.1 * web3.LAMPORTS_PER_SOL, web3.Keypair.generate().publicKey)
}

function initializeKeyPair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    return web3.Keypair.fromSecretKey(secretKey)
}
// In the main function to be called, we require a transaction, a signature, and instructions to sendAndConfirmPayment.

async function sendSol(connection: web3.Connection, payer: web3.Keypair, amount: number, to: web3.PublicKey) {
    const transaction = new web3.Transaction()

    const sendSol = web3.SystemProgram.transfer(
        {
            fromPubkey: payer.publicKey,
            toPubkey: to,
            lamports: amount
        }
    )
    transaction.add(sendSol)

    const signature = await web3.sendAndConfirmTransaction(connection,
        transaction, [payer])

    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);

}

main().then(() => {
    console.log("finished execution");
}).catch((error) => {
    console.log(error);
})