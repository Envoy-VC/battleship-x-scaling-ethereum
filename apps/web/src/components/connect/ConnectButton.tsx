import React from 'react';

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

  const onConnect = async () => {
    try {
      const connector = connectors[0] as Connector;
      connect({ connector });
    } catch (error) {
      toast((error as Error).message);
    }
  };

  if (!isConnected) {
    return <Button onClick={onConnect}>Connect</Button>;
  } else {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Connected</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
};

export default ConnectButton;
