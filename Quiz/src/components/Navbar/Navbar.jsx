import { Link } from 'react-router-dom';
import useQuestionStore from '../../store/zustand';
import { WagmiProvider, useAccount } from 'wagmi';
import Account from '../Account';
import { WalletOptions } from '../WalletOptions';
import { TonConnectButton } from '@tonconnect/ui-react';

function ConnectWallet() {
    const { isConnected } = useAccount();
    if (isConnected) return <Account />;
    return <WalletOptions />;
}

function Navbar() {
    return (
        <nav className="w-full bg-transparent text-neutral-900 px-5 md:px-10 flex items-center justify-between py-5 text-sm border-b-slate-200 border">
            <Link to="/" className="text-neutral-900 hover:text-orange-500">
                <h1 className="text-orange-500 text-2xl font-bold tracking-tight flex items-center gap-1">
                    Jay<span className="text-neutral-900"> Quiz</span>
                    {/* <div className="w-2 h-2 bg-red-500 mt-2 ml-1 rounded-full" /> */}
                </h1>
            </Link>
            <div className="space-x-5 flex items-center">
                <TonConnectButton className="my-button-class" style={{ float: 'right' }} />
                {/* <ConnectWallet /> */}
                <div>
                    <Link to="/my-nft" className="text-neutral-900 hover:text-orange-500">
                        <button className="text-neutral-900 border-2 p-2 border-black hover:text-orange-500 w-40">
                            My NFT's
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
