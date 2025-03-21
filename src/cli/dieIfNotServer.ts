import { isServer } from '../any/isServer.ts';

export const dieIfNotServer = () => {
  if (!isServer) {
    console.error('This script should not be included in a client script');
    Deno.exit(1);
  }
}