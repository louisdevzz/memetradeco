"use client";

import Link from 'next/link';
import {  
    Star,
    Clock,
    Copy,
    ArrowLeft,
    ChevronRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from 'next/navigation';
import Chart from '@/components/chart';
import Overview from '@/components/custom/Overview';
import Social from '@/components/custom/Social';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';   
import { useMemo, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { NextPage } from 'next';
import { useReadContract, useWriteContract, useAccount,useBalance, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { parseEther, formatUnits, parseUnits, MaxUint256 } from "ethers";
import { bondingCurveAbi } from '@/abi/bondingCurveAbi';
import Launching from '@/components/custom/Launching';
import { decodeEventLog } from 'viem';
import { tokenAbi } from '@/abi/tokenAbi';
import { useEthPrice } from '@/hooks/useEthPrice';
import { useSonicPrice } from '@/hooks/useSonicPrice';
import { useSwitchChain } from 'wagmi';
import { configAncient8 } from '@/wagmi';
import { configSonicBlaze } from '@/wagmi';
import { formatNumber } from '@/utils/utils';
import { INITIAL_SUPPLY } from '@/lib/contants';

const TokenDetails: NextPage = () => {
    const { address: tokenAddress } = useParams();
    const { address } = useAccount();
    const [amount, setAmount] = useState<string|null>(null);
    const { writeContractAsync } = useWriteContract();
    const [timeRange, setTimeRange] = useState('30d');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [transactionType, setTransactionType] = useState<string | null>(null);
    const [amountEthToReceive, setAmountEthToReceive] = useState<string|null>(null);
    const { switchChain } = useSwitchChain();
    const { data: sonicPriceData, isLoading: sonicPriceLoading } = useSonicPrice();
    const { data: ethPriceData, isLoading: ethPriceLoading } = useEthPrice();
  
    // Get the ETH price for calculations, fallback to 2500 if not available
    const ethPrice = useMemo(() => {
      return ethPriceData?.price || 2500;
    }, [ethPriceData]);
    
    const sonicPrice = useMemo(() => {
      return sonicPriceData?.price || 0.7;
    }, [sonicPriceData]);

    
    
    // console.log('balanceOfToken', balanceOfToken);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers and decimal points
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleAmountClick = (value: number) => {
        setAmount(value.toString());
    };

    const getDaysAgo = (date: Date) => {
        const diffTime = Math.abs(new Date().getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `(${diffDays}d ago)`;
    };

    const fetchTokenByAddress = async () => {
        const token = await fetch(`/api/token?address=${tokenAddress?.toString()}`,{
            next: { revalidate: 60 },
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        return token.json();
    }

    const { data: token, isLoading } = useQuery({
        queryKey: ['token', tokenAddress],
        queryFn: () => fetchTokenByAddress(),
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    const tokenData = useMemo(() => {
        if (!token) return null;
        return {
            ...token.data,
            createdAt: token.data?.createdAt ? new Date(token.data.createdAt) : null
        };
    }, [token]);

    const { data: balance, refetch: refetchBalance } = useBalance({
        address: address,
        config: tokenData?.network == "Sonic" ? configSonicBlaze : configAncient8
    });

    const {data: balanceOfToken, refetch: refetchBalanceOfToken} = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        config: tokenData?.network == "Sonic" ? configSonicBlaze : configAncient8
    });
    // console.log('tokenData', tokenData);

    const { data: receipt, isError: isConfirmationError } = useWaitForTransactionReceipt({
        hash: txHash as `0x${string}`,
        config: tokenData?.network == "Sonic" ? configSonicBlaze : configAncient8
    });
    
    // console.log('Receipt:', receipt);

    // Handle transaction receipt
    useEffect(() => {
        const processReceipt = async () => {
            if (receipt) {
                const loadingToast = toast.loading('Processing...');
                
                try {
                    // Find the token address from the logs
                    const eventLog = receipt.logs.find(log => {
                        try {
                            const decoded = decodeEventLog({
                                abi: bondingCurveAbi,
                                data: log.data,
                                topics: log.topics,
                            });
                            // console.log('Decoded:', decoded);
                            return decoded.eventName === 'UpdateInfo';
                        } catch {
                            return false;
                        }
                    });

                    if (eventLog) {
                        const decoded = decodeEventLog({
                            abi: bondingCurveAbi,
                            data: eventLog.data,
                            topics: eventLog.topics,
                        });
                        await refetchBalanceOfToken();
                        const { newPrice, newSupply, newTotalMarketCap, newFundingRaised, amountTokenToReceive } = decoded.args as any;
                        // console.log('newPrice', newPrice);
                        // console.log('newSupply', newSupply);
                        // console.log('newTotalMarketCap', newTotalMarketCap);
                        // console.log('newFundingRaised', newFundingRaised);

                        if(transactionType === 'BUY'){
                            await fetch(`/api/transactions`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userAddress: address,
                                    tokenAddress: tokenData?.address,
                                    network: tokenData?.network,
                                    price: tokenData?.network == "Sonic" ? parseFloat(formatUnits(newPrice||BigInt(0), 18)) : parseFloat(formatUnits(newPrice||BigInt(0), 18)),
                                    amountToken: parseFloat(amount||"0"),
                                    transactionType: 'BUY',
                                    transactionHash: txHash as `0x${string}`,
                                    totalSupply: parseFloat(newSupply||"0"),
                                    marketCap: parseFloat(newTotalMarketCap||"0"),
                                    amountTokensToReceive: parseFloat(formatUnits(amountTokenToReceive||BigInt(0), 18)),
                                    fundingRaised: parseFloat(formatUnits(newFundingRaised||BigInt(0), 18))
                                }),
                            });
                            await writeContractAsync({
                                address: tokenData?.address as `0x${string}`,
                                abi: tokenAbi,
                                functionName: 'approve',
                                args: [tokenData?.curveAddress as `0x${string}`, MaxUint256]
                            });
                            setAmount(null);
                            await refetchBalanceOfToken();
                            toast.success('Buy successful!', { id: loadingToast });
                        }else{
                            // Save price history after successful transaction
                            await fetch(`/api/transactions`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    tokenAddress: tokenData?.address,
                                    network: tokenData?.network,
                                    price: parseFloat(formatUnits(newPrice||BigInt(0), 18)),
                                    userAddress: address,
                                    amountToken: parseFloat(amountEthToReceive||"0"),
                                    transactionType: 'SELL',
                                    transactionHash: txHash as `0x${string}`,
                                    totalSupply: parseFloat(newSupply||"0"),
                                    marketCap: parseFloat(newTotalMarketCap||"0"),
                                    amountTokensToReceive: parseFloat(amount||"0"),
                                    fundingRaised: parseFloat(formatUnits(newFundingRaised||BigInt(0), 18))
                                }),
                            });
                            await refetchBalanceOfToken();
                            toast.success('Sell successful!', { id: loadingToast });
                            setAmount(null);
                        }
                        

                    }
                } catch (error) {
                    console.error('Error processing transaction receipt:', error);
                    toast.error('Error processing transaction receipt');
                }
            }
        };

        processReceipt();
    }, [receipt]);

    // Handle confirmation error
    useEffect(() => {
        if (isConfirmationError) {
            console.error('Transaction confirmation failed');
            toast.error('Transaction confirmation failed');
        }
    }, [isConfirmationError]);

    const {data: totalSupply} = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'balanceOf',
        args: [tokenData?.curveAddress as `0x${string}`],
        config: tokenData?.network == "Sonic" ? configSonicBlaze : configAncient8
    });




    const { data: tokensToReceive, refetch: refetchTokensToReceive } = useReadContract({
        address: tokenData?.curveAddress as `0x${string}`,
        abi: bondingCurveAbi,
        functionName: 'calculateTokensForEth',
        args: [parseEther(amount && /^\d*\.?\d*$/.test(amount) ? amount : "0")],
        config: tokenData?.network == "Sonic" ? configSonicBlaze : configAncient8   
    });

    const { data: ethToReceive } = useReadContract({
        address: tokenData?.curveAddress as `0x${string}`,
        abi: bondingCurveAbi,
        functionName: 'calculateEthForTokens',
        args: [parseEther(amount && /^\d*\.?\d*$/.test(amount) ? amount : "0")],
        config: tokenData?.network == "Sonic" ? configSonicBlaze : configAncient8
    });


    const { data: transactionHistory, refetch: refetchTransactionHistory } = useQuery({
        queryKey: ['transactionHistory', tokenData?.address, timeRange],
        queryFn: async () => {
            const response = await fetch(`/api/transactions?tokenAddress=${tokenData?.address}&timeRange=${timeRange}`);
            const data = await response.json();
            return data.data;
        },
        enabled: !!tokenData?.address,
        staleTime: 1000, // Set to 1 second to allow frequent updates
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: 5000, // Refetch every 5 seconds
    });

    const totalMarketCapToken = useMemo(() => {
        if (!transactionHistory) return 0;
    
        const ancient8Transactions = transactionHistory.filter((tx: any) => tx.network === 'Ancient8')
        const ancient8TokenPrice = ancient8Transactions[ancient8Transactions.length - 1]?.price;
        const ancient8MarketCap = ancient8TokenPrice * ethPrice * INITIAL_SUPPLY;
        const sonicTransactions = transactionHistory.filter((tx: any) => tx.network === 'Sonic');
        const sonicTokenPrice = sonicTransactions[sonicTransactions.length - 1]?.price;
        const sonicMarketCap = sonicTokenPrice * sonicPrice * INITIAL_SUPPLY;
        return ancient8MarketCap || sonicMarketCap;
    }, [transactionHistory]);
      

    // /console.log('transactionHistory', transactionHistory);
    
    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value);
    };

    // Add this helper function near the top of the component
    const calculatePercentageAmount = (balance: bigint, percentage: number) => {
        const balanceNum = parseFloat(formatUnits(balance || BigInt(0), 18));
        return (balanceNum * percentage / 100).toString();
    };

    if (isLoading || !tokenData) {
        return <div>Loading...</div>;
    }


    const handleBuy = async () => {
        if (!amount) return toast.error('Please enter an amount');
        if (!address) return toast.error('Please connect your wallet');
        if(tokenData?.network == "Sonic"){
            switchChain({
                chainId: 57054
            });
        }else{
            switchChain({
                chainId: 28122024
            });
        }
        if (BigInt(tokensToReceive||0) <= 0) return toast.error('Insufficient tokens to receive');
        if (balance && balance.value < parseEther(amount||"0")){
            return toast.error('Insufficient balance');
        }

        const loadingToast = toast.loading('Buying...');
        try {
            await refetchTokensToReceive();
            const tx = await writeContractAsync({
                address: tokenData?.curveAddress as `0x${string}`,
                abi: bondingCurveAbi,
                functionName: 'buy',
                value: parseEther(amount||"0"),
                args: [BigInt(tokensToReceive||0), address as `0x${string}`]
            });
            setTransactionType('BUY');
            setTxHash(tx as `0x${string}`);
            toast.success("Please wait for the transaction to be confirmed", { id: loadingToast });
        } catch (error: any) {
            console.error('Buy error:', error);
            if (error.code === 4001 || error.message?.includes('User rejected')) {
                toast.error('Transaction rejected by user', { id: loadingToast });
            } else if (error.code === -32603) {
                toast.error('Internal JSON-RPC error. Please check your wallet balance.', { id: loadingToast });
            } else {
                toast.error('Failed to buy', { id: loadingToast });
            }
        }
    }

    // console.log('ethToReceive', ethToReceive);
    // console.log(parseEther(amount||"0"))
    const handleSell = async () => {
        if (!amount) return toast.error('Please enter an amount');
        if (!address) return toast.error('Please connect your wallet');

        if(tokenData?.network == "Sonic"){
            switchChain({
                chainId: 57054
            });
        }else{
            switchChain({
                chainId: 28122024
            });
        }

        const loadingToast = toast.loading('Selling...');
        try {
            await refetchTokensToReceive();
            setAmountEthToReceive(ethToReceive?.toString()||"0");
            const tx = await writeContractAsync({
                address: tokenData?.curveAddress as `0x${string}`,
                abi: bondingCurveAbi,
                functionName: 'sell',
                args: [parseEther(amount||"0"), ethToReceive||BigInt(0)]
            });
            setTransactionType('SELL');
            setTxHash(tx as `0x${string}`);
            toast.success("Please wait for the transaction to be confirmed", { id: loadingToast });
            
        } catch (error: any) {
            console.error('Sell error:', error);
            if (error.code === 4001 || error.message?.includes('User rejected')) {
                toast.error('Transaction rejected by user', { id: loadingToast });
            } else if (error.code === -32603) {
                toast.error('Internal JSON-RPC error. Please check your token balance.', { id: loadingToast });
            } else {
                toast.error('Failed to sell', { id: loadingToast });
            }
        }
    }

    return (
    <div className="min-h-screen bg-[#0B0E17] pb-[60px] sm:pb-0">
      {/* Top Navigation Bar */}
        <div className="bg-[#0B0E17] top-0 sm:top-12 border-[#1F2937] border-b sm:border-b-0">
            <div className="container mx-auto py-2 sm:py-4 lg:px-4 pt-2 flex md:items-center justify-between gap-4 max-lg:px-4 flex-col md:flex-row mb-0 lg:mt-8">
                <div className="flex items-center gap-2 justify-between sm:justify-start">
                    <Link href="/" className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <div className="w-7 h-7 bg-[#161B28] flex items-center justify-center border border-[#1F2937] hover:border-gray-600">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                        </Button>
                        <div className="hidden sm:flex items-center gap-2 border border-[#1F2937] px-3 py-1 hover:border-gray-600 transition-colors duration-200">
                            <p className="text-gray-400 text-sm font-medium">{tokenData?.ticker}</p>
                        </div>
                    </Link>
                    
                    <ChevronRight className="w-4 h-4 text-gray-500 hidden sm:block" />
                    
                    <div className="hidden sm:block">
                        <button className="flex items-center justify-center gap-3 px-3 py-1 text-sm font-medium text-gray-400 border border-[#1F2937] hover:bg-[#1C2333] hover:border-gray-600 transition-all duration-200">
                            <img 
                                className="w-5 h-5 rounded-md" 
                                alt={tokenData?.name} 
                                src={tokenData?.imageUrl} 
                                loading="lazy" 
                            />
                            {tokenData?.name}
                        </button>
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        className="group/star text-gray-400 hover:text-white p-0 transition-colors duration-200"
                    >
                        <span className="flex items-center gap-3 border border-[#1F2937] px-4 py-1 hover:border-gray-600">
                            <Star className="w-4 h-4" />
                            Add to watchlist
                        </span>
                    </Button>
                </div>
                <div className="hidden md:block">
                <div role="list" dir="ltr" className="flex items-center justify-center border-[#1F2937] shadow-sm rounded-lg p-[1px] gap-0 !w-full md:!w-max md:!mx-0 border py-2 h-[40px]">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleTimeRangeChange('24h')}
                        className={`text-gray-400 hover:text-white ${timeRange === '24h' ? 'bg-[#161B28] text-white' : ''}`}
                    >
                        24h
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleTimeRangeChange('3d')}
                        className={`text-gray-400 hover:text-white ${timeRange === '3d' ? 'bg-[#161B28] text-white' : ''}`}
                    >
                        3D
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleTimeRangeChange('7d')}
                        className={`text-gray-400 hover:text-white ${timeRange === '7d' ? 'bg-[#161B28] text-white' : ''}`}
                    >
                        7D
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleTimeRangeChange('14d')}
                        className={`text-gray-400 hover:text-white ${timeRange === '14d' ? 'bg-[#161B28] text-white' : ''}`}
                    >
                        14D
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleTimeRangeChange('30d')}
                        className={`text-gray-400 hover:text-white ${timeRange === '30d' ? 'bg-[#161B28] text-white' : ''}`}
                    >
                        30D
                    </Button>
                </div>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto flex flex-col sm:mt-4 mb-6 lg:px-4 lg:mb-12">
            <div className="lg:mb-10 hidden sm:block">
                <div className="flex max-lg:p-2 h-full w-full lg:justify-between relative">
                    <div className="hidden lg:grid lg:grid-cols-[1fr,_420px] gap-4 w-full">
                        <div className="w-full lg:flex hidden flex-col">
                            <div className="lg:flex w-full items-center">                        
                                <div className="lg:flex items-center gap-3 h-full hidden">
                                    <img 
                                        src={tokenData?.imageUrl}
                                        alt="Token Logo"
                                        className="w-28 h-28 rounded-xl"
                                        loading="lazy"
                                        width={64}
                                        height={64}
                                    />
                                    <div className="lg:flex flex-col justify-center h-full">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h1 className="text-3xl font-medium mb-1 text-white">{tokenData?.name}</h1>
                                            </div>
                                            <p className="text-xs text-gray-400">@{tokenData?.ticker}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-col gap-2 mt-4 space-y-4">
                                <div className="text-white text-sm">
                                    {tokenData?.description}
                                </div>
                                <div className="flex items-center gap-4 mb-2">
                                    {tokenData?.twitterUrl && (
                                        <Link 
                                            href={tokenData.twitterUrl} 
                                            target="_blank"
                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-[#161B28] border border-[#1F2937] hover:text-white hover:border-gray-600 transition-colors rounded-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                                            </svg>
                                            Twitter
                                        </Link>
                                    )}
                                    {tokenData?.websiteUrl && (
                                        <Link 
                                            href={tokenData.websiteUrl} 
                                            target="_blank"
                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-[#161B28] border border-[#1F2937] hover:text-white hover:border-gray-600 transition-colors rounded-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="2" y1="12" x2="22" y2="12"/>
                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                            </svg>
                                            Website
                                        </Link>
                                    )}
                                    {tokenData?.telegramUrl && (
                                        <Link 
                                            href={tokenData.telegramUrl} 
                                            target="_blank"
                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-[#161B28] border border-[#1F2937] hover:text-white hover:border-gray-600 transition-colors rounded-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.303l3.984 1.028 2.25 6.75a2.25 2.25 0 0 0 4.203.495l7.5-16.5a2.25 2.25 0 0 0-1.041-3.791z"/>
                                            </svg>
                                            Telegram
                                        </Link>
                                    )}
                                </div>
                            </div>
                            
                        </div>
                        <div className="ml-auto w-max hidden lg:block">
                            <div className="grid grid-cols-2 max-h-[86px]">
                                <div className="w-52 h-[86px] justify-between flex flex-col border border-[#1F2937] px-4 py-2 bg-[#161B28]">
                                    <div className="flex flex-col h-full">
                                        <div className="text-sm mb-auto flex items-center gap-1.5 font-medium text-gray-400">
                                            <img alt="Chain" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" className="w-6" src={tokenData?.network == "Sonic" ? "https://testnet.sonicscan.org/assets/sonic/images/svg/logos/chain-dark.svg?v=25.2.3.0" : "/assets/chains/a8.png"}    style={{ color: 'transparent' }} />
                                            Contract address
                                        </div>
                                        <div className="flex text-sm items-center gap-1 mt-1.5 text-gray-400 hover:text-white">
                                            {tokenData?.address ? (
                                                <Link href={`${tokenData?.network == "Sonic" ? "https://testnet.sonicscan.org/address/" : "https://scanv2-testnet.ancient8.gg/address/"}${tokenData.address}`} className='hover:underline' target="_blank">
                                                    {tokenData.address.slice(0, 4)}...{tokenData.address.slice(-4)}
                                                </Link>
                                            ) : (
                                                <span>Address not available</span>
                                            )}
                                            <button className="ml-1 text-gray-400 hover:text-white">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-l-0 w-52 h-[86px] justify-between flex flex-col border border-[#1F2937] px-4 py-2 bg-[#161B28]">
                                    <div>
                                        <div className="text-sm flex items-center gap-1.5 font-medium text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            Created
                                        </div>
                                        <div className="flex text-sm items-center gap-1 mt-1.5 text-gray-400">
                                            {tokenData?.createdAt ? (
                                                <>
                                                    {tokenData.createdAt.toLocaleDateString()} 
                                                    <span className="text-gray-500">
                                                        {getDaysAgo(tokenData.createdAt)}
                                                    </span>
                                                </>
                                            ) : (
                                                'N/A'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* Mobile View */}
                    <div className="flex flex-col lg:hidden">
                        <div className="flex gap-3 items-center">
                            <div>
                                <div className="flex flex-col gap-0">
                                    <div className="mb-1 flex items-center gap-1.5">
                                        <div className="flex items-center justify-center font-sans font-medium w-fit gap-1 rounded-full px-2 py-1 text-xs h-auto bg-[#161B28] border-[#1F2937] text-gray-400 border">
                                            {tokenData?.ticker}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <h1 className="text-2xl font-medium font-display mb-1 text-white">{tokenData?.name}</h1>
                                    </div>
                                    <p className="text-xs text-gray-400">{tokenData?.ticker}</p>
                                    <div className="mt-2 flex items-center gap-1">
                                        <div className="flex items-center rounded justify-center font-sans font-medium w-fit bg-[#161B28] text-gray-400 h-6 gap-1 text-xs px-2 border border-[#1F2937]">
                                            {tokenData?.ticker}
                                        </div>
                                        <Link href={`${tokenData?.network == "Sonic" ? "https://testnet.sonicscan.org/address/" : "https://scanv2-testnet.ancient8.gg/address/"}${tokenData?.address}`} target="_blank" className="flex items-center rounded justify-center font-medium w-fit bg-[#161B28] text-gray-400 text-[10px] leading-[12px] gap-1 px-1 h-auto py-1 border border-[#1F2937]">
                                            <img alt="Chain" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" className="w-4" src={tokenData?.network == "Sonic" ? "https://testnet.sonicscan.org/assets/sonic/images/svg/logos/chain-dark.svg?v=25.2.3.0" : "/assets/chains/a8.png"}    style={{ color: 'transparent' }} />
                                            {tokenData?.address.slice(0, 4)}...{tokenData?.address.slice(-4)}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs mt-2 text-gray-400">
                            {tokenData?.description}
                        </p>
                    </div>

                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-[#1F2937]">
                <div className="">
                <Tabs defaultValue="trade" className="w-full">
                    <div className="flex-wrap">
                        <div className="flex items-center justify-between mb-4 border-b border-[#1F2937]">
                            <TabsList className="h-[62px] w-full justify-start gap-6 bg-transparent">
                                <TabsTrigger 
                                    value="trade"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none px-0 text-xs md:text-base font-medium text-gray-400 data-[state=active]:text-white whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-1">Trade</div>
                                </TabsTrigger>      
                                <TabsTrigger 
                                    value="analytics"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none px-0 text-xs md:text-base font-medium text-gray-400 data-[state=active]:text-white whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-1 text-xs md:text-base">Analytics</div>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="social"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none px-0 text-xs md:text-base font-medium text-gray-400 data-[state=active]:text-white whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-1">Social</div>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="message"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none px-0 text-xs md:text-base font-medium text-gray-400 data-[state=active]:text-white whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-1 ">Message</div>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="launching"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none px-0 text-xs md:text-base font-medium text-gray-400 data-[state=active]:text-white whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-1 ">Launching</div>
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    <TabsContent value="trade" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr,_400px] gap-4">
                                <div className="h-[300px] sm:h-[400px] md:h-[550px] border rounded-lg relative flex flex-col border-[#1F2937] bg-[#161B28]">
                                    <div className="h-[80px] sm:h-[100px] flex justify-between p-4 border-b border-[#1F2937]">
                                        <div>
                                            <p className="text-2xl sm:text-4xl font-medium text-white">{(transactionHistory?.[transactionHistory.length - 1]?.price||0).toFixed(10)} {tokenData?.network}</p>
                                            {/* <span className="text-sm flex gap-1 items-center text-red-400">
                                                -20.15% <span>(7D)</span>
                                            </span> */}
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full p-2 sm:p-4 relative">
                                        <div className="flex flex-col w-full h-full relative pt-3">
                                            <Chart 
                                                transactionHistory={transactionHistory || []} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-[#1F2937] p-2 overflow-hidden h-[450px] sm:h-[550px] rounded-lg bg-[#161B28]">
                                    <Tabs defaultValue="buy" className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="w-[200px]">
                                                <TabsList className="grid w-full grid-cols-3 bg-[#0B0E17]">
                                                    <TabsTrigger 
                                                        value="buy"
                                                        className="text-gray-400 data-[state=active]:text-white"
                                                    >
                                                        Buy
                                                    </TabsTrigger>
                                                    <TabsTrigger 
                                                        value="sell"
                                                        className="text-gray-400 data-[state=active]:text-white"
                                                    >
                                                        Sell
                                                    </TabsTrigger>
                                                    <TabsTrigger 
                                                        value="auto"
                                                        className="text-gray-400 data-[state=active]:text-white"
                                                    >
                                                        Auto
                                                    </TabsTrigger>
                                                </TabsList>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400">Balance:</span>
                                                <span className="text-sm font-medium text-white">{formatNumber(Number(balanceOfToken||BigInt(0))/10**18)} {tokenData?.ticker}</span>
                                            </div>
                                        </div>
                                        <TabsContent value="buy">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-gray-400">Amount</span>
                                                    <div className="flex items-center gap-2 border border-[#1F2937] px-2 bg-[#0B0E17]">
                                                        <Input 
                                                            type="number"
                                                            placeholder="0.0"
                                                            step="0.01"
                                                            min="0"
                                                            value={amount||''}
                                                            onChange={handleAmountChange}
                                                            className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent text-white" 
                                                        />
                                                        <span className="text-gray-400">S</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <button 
                                                            onClick={() => handleAmountClick(1)}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            1
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAmountClick(2)}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            2
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAmountClick(5)}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            5
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAmountClick(10)}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            10
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <span>You will receive: {formatNumber(Number(tokensToReceive?.toString()||"0")/10**18)} {tokenData?.ticker}</span>
                                                </div>
                                                <Button onClick={handleBuy} className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors">
                                                    Buy
                                                </Button>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="sell">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-gray-400">Amount</span>
                                                    <div className="flex items-center gap-2 border border-[#1F2937] px-2 bg-[#0B0E17]">
                                                        <Input 
                                                            type="text"
                                                            placeholder="0.0"
                                                            value={amount||''}
                                                            onChange={handleAmountChange}
                                                            className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent text-white" 
                                                        />
                                                        <span className="text-gray-400">{tokenData?.ticker}</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <button 
                                                            onClick={() => setAmount(calculatePercentageAmount(balanceOfToken || BigInt(0), 10))}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            10%
                                                        </button>
                                                        <button 
                                                            onClick={() => setAmount(calculatePercentageAmount(balanceOfToken || BigInt(0), 30))}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            30%
                                                        </button>
                                                        <button 
                                                            onClick={() => setAmount(calculatePercentageAmount(balanceOfToken || BigInt(0), 50))}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            50%
                                                        </button>
                                                        <button 
                                                            onClick={() => setAmount(calculatePercentageAmount(balanceOfToken || BigInt(0), 100))}
                                                            className="px-4 py-2 text-sm font-medium border border-[#1F2937] rounded-md hover:bg-[#1C2333] text-gray-400"
                                                        >
                                                            100%
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <span>You will receive: {formatNumber(Number(ethToReceive?.toString()||"0")/10**18)} S</span>
                                                </div>
                                                <Button onClick={handleSell} className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors">
                                                    Sell
                                                </Button>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="auto">
                                            <span className="text-gray-400">Coming Soon</span>
                                        </TabsContent>  
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        
                    </TabsContent>
                    <TabsContent value="analytics" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-gray-400">Coming Soon</span>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="social" className="mt-4">
                        <Social tokenData={tokenData} />
                    </TabsContent>
                    <TabsContent value="message" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-gray-400">Coming Soon</span>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="launching" className="mt-4">
                        <Launching totalMarketCap={totalMarketCapToken} totalSupply={parseFloat(totalSupply?.toString()||"0")} symbol={tokenData?.ticker||''} transactions={transactionHistory as any|| []} bondingCurveAddress={tokenData?.curveAddress||''} tokenAddress={tokenData?.address||''} network={tokenData?.network||''} sonicPrice={sonicPrice} ethPrice={ethPrice} />
                    </TabsContent>
                </Tabs>
                </div>
            </div>
            
        </div>      
    
    </div>
    );
} 


export default TokenDetails;