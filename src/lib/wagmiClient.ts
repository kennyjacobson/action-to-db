import { createPublicClient, http, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

const privateKey = process.env.NFT_STORE_SECRET_KEY
export const account = privateKeyToAccount(`0x${privateKey}`)
 
export const publicClient = createPublicClient({
  chain: base,
  transport: http()
})

export const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http()
})

// const privateKey = NFT_STORE_SECRET_KEY


