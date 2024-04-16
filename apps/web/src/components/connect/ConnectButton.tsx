import React from 'react';

import { useNillion } from '~/lib/hooks';

import { toast } from 'sonner';
import { Connector, useAccount, useConnect } from 'wagmi';

import { Button } from '~/components/ui/button';

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

  React.useEffect(() => {
    if (isConnected) {
      onConnectWithNillion();
    }
  }, [isConnected]);

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
      {!isConnected && (
        <Button onClick={onConnect} variant='secondary'>
          Connect
        </Button>
      )}
      {isConnected && !nillion.connectedToSnap && (
        <Button onClick={onConnectWithNillion} variant='secondary'>
          Connect to Nillion
        </Button>
      )}
      {isConnected && nillion.connectedToSnap && (
        <Button variant='secondary'>Connected</Button>
      )}
    </div>
  );
};

export default ConnectButton;
