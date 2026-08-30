import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import type { Fizzbuzz } from "../target/types/fizzbuzz";

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Fizzbuzz as anchor.Program<Fizzbuzz>;

// Find the Program Derived Address (PDA) for your Fizzbuzz account
const [fizzbuzzPda] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("fizzbuzz"), program.provider.publicKey.toBuffer()],
  program.programId
);

console.log("Fizzbuzz PDA:", fizzbuzzPda.toString());

// 1. Initialize the Fizzbuzz account on-chain
try {
  const initTx = await program.methods
    .init()
    .accounts({
      fizzbuzz: fizzbuzzPda,
      owner: program.provider.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
  console.log("Init transaction signature:", initTx);
} catch (err) {
  console.log("Account may already be initialized:", err);
}

// 2. Call the doFizzbuzz instruction with a test number (e.g., 15)
const testNum = new BN(15);
const doTx = await program.methods
  .doFizzbuzz(testNum)
  .accounts({
    fizzbuzz: fizzbuzzPda,
  })
  .rpc();

console.log(`Executed doFizzbuzz(${testNum}) signature:`, doTx);

// 3. Fetch and display the account state
const fizzbuzzAccount = await program.account.fizzBuzz.fetch(fizzbuzzPda);
console.log("Account State:", {
  fizz: fizzbuzzAccount.fizz,
  buzz: fizzbuzzAccount.buzz,
  n: fizzbuzzAccount.n.toString(),
});