import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { getProgram } from './solana';
import { Analytics } from '@vercel/analytics/react';

import '@solana/wallet-adapter-react-ui/styles.css';

function MainContent() {
  const wallet = useWallet();

  const handleTestProgram = () => {
    if (!wallet.connected) {
      alert('Please connect your wallet first!');
      return;
    }
    try {
      const program = getProgram(wallet);
      console.log('Connected Program ID:', program.programId.toBase58());
      alert(`Program Loaded! ID: ${program.programId.toBase58()}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Soldiery Coin Interface</h1>
      <div style={{ margin: '1rem 0' }}>
        <WalletMultiButton />
      </div>
      <button onClick={handleTestProgram} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Test Program Connection
      </button>
    </div>
  );
}

export default function App() {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MainContent />
          <Analytics />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
