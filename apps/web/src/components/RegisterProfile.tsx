import React from 'react';

import { battleShipContract } from '~/lib/viem';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';

import { Button } from './ui/button';
import { Input } from './ui/input';

const RegisterProfile = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [username, setUsername] = React.useState<string>('');

  const { data: user } = useReadContracts({
    contracts: [
      { ...battleShipContract, functionName: 'balanceOf', args: [address!] },
      {
        ...battleShipContract,
        functionName: '_ownedTokens',
        args: [address!, BigInt(0)],
      },
    ],
    query: {
      enabled: !!address,
    },
  });

  const { data: userTokenId } = useReadContracts({
    contracts: [
      {
        ...battleShipContract,
        functionName: 'childrenOf',
        args: user?.[1]?.result ? [user?.[1]?.result] : undefined,
      },
    ],
    query: {
      enabled: !!address,
    },
  });

  const { data: tokenURIs } = useReadContracts({
    contracts: [
      ...(userTokenId?.[0]?.result ?? [])?.map((token) => {
        return {
          ...battleShipContract,
          functionName: 'tokenURI',
          args: [token.tokenId],
        } as const;
      }),
    ],
    query: {
      enabled: !!userTokenId?.[0]?.result?.length,
    },
  });

  const isRegistered = user?.[0]?.result ?? BigInt(0) !== BigInt(0);

  const register = async () => {
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    try {
      await writeContractAsync({
        ...battleShipContract,
        functionName: 'register',
        args: [address!, username],
      });
    } catch (error) {
      toast.error((error as Error)?.message);
      console.log(error);
    }
  };

  if (isRegistered) {
    return (
      <div className='flex flex-col w-full gap-2'>
        <div className='text-xl font-medium'>Owned NFTs</div>
        <div className='flex flex-row flex-wrap items-center gap-2'>
          {tokenURIs?.map((uri, index) => {
            return <UserNFT key={index} uri={uri?.result ?? ''} />;
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className='flex flex-col w-full gap-2'>
        <div className='text-xl font-medium'>Register Profile</div>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
        />
        <Button onClick={register}>Register</Button>
      </div>
    );
  }
};

export default RegisterProfile;

interface NFT {
  name: string;
  description: string;
  image: string;
}

interface UserNFTProps {
  uri: string;
}
const UserNFT = ({ uri }: UserNFTProps) => {
  const getNFT = async () => {
    const url = `https://ipfs.io/ipfs/${uri.slice(7)}`;

    const response = await fetch(url);
    const data = (await response.json()) as NFT;
    return data;
  };

  const { data } = useQuery({
    queryKey: ['nft', uri],
    queryFn: getNFT,
  });

  return (
    <div className='flex flex-col rounded-md overflow-hidden shadow-md'>
      <img
        src={`https://ipfs.io/ipfs/${data?.image?.slice(7)}`}
        className='rounded-t-md object-cover aspect-square max-w-[128px] w-full '
      />
      <div className='p-1'>
        <div className='font-medium'>{data?.name}</div>
      </div>
    </div>
  );
};
