import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import type { Idl } from '@coral-xyz/anchor';

const programId = new PublicKey('9fmTQVorEDfyoUQErb1fFfgxsKYWpwhmmeqZopo72h2Y');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const getProgram = (wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  return new Program(idl as any, programId, provider);
};
