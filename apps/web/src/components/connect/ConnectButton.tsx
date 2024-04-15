import React from 'react';

import { useNillion } from '~/lib/hooks';

import { toast } from 'sonner';
import { Connector, useAccount, useConnect } from 'wagmi';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

const ConnectButton = () => {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { nillion, getUserKey, setNillion } = useNillion();

  const onConnect = async () => {
    try {
      const connector = connectors[0] as Connector;
      connect({ connector });
    } catch (error) {
      toast((error as Error).message);
    }
  };

  const onConnectWithNillion = async () => {
    try {
      const response = await getUserKey();

      if (response.connectedToSnap === false) {
        toast('Error connecting to Nillion');
        return;
      }

      setNillion(response);
    } catch (error) {
      toast((error as Error).message);
    }
  };

  return (
    <div>
      {!isConnected && <Button onClick={onConnect}>Connect</Button>}
      {isConnected && !nillion.connectedToSnap && (
        <Button onClick={onConnectWithNillion}>Connect to Nillion</Button>
      )}
      {isConnected && nillion.connectedToSnap && <Button>Connected</Button>}
    </div>
  );
};

export default ConnectButton;
