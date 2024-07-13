import { publicClient, account, walletClient } from './wagmiClient.js'
import { wagmiAbi } from './abi.js'

export async function transferNft(
  tokenId: number,
  recipient: string
) {
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS
    const nftStorePublicKey = process.env.NFT_STORE_PUBLIC_KEY

    // const data = await publicClient.readContract({
    //     address: `0x${contractAddress}`,
    //     abi: wagmiAbi,
    //     functionName: 'totalSupply',
    //   })
    // console.log(data)

    const from = `0x${nftStorePublicKey}` as `0x${string}`
    const to = recipient as `0x${string}`
    const id = BigInt(tokenId)
    const value = BigInt(1)
    const data = '0x'

    console.log(`Transferring ${value} copy of NFT ${id} from ${from} to ${to}`)

    const {result} = await publicClient.simulateContract({
        address: `0x${contractAddress}`,
        abi: wagmiAbi,
        functionName: 'safeTransferFrom',
        args: [from, to, id, value, data],
        account : account
      })

    console.log(result)

    const hash = await walletClient.writeContract({
        address: `0x${contractAddress}`,
        abi: wagmiAbi,
        functionName: 'safeTransferFrom',
        args: [from, to, id, value, data]
      })
    
    console.log(hash)
}

