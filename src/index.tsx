import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/hubs'
import neynarClient from './lib/neynarClient.js'
import {appendToSheet} from './lib/googleSheetClient.js'
import { transferNft } from './lib/transferNft.js'

export const app = new Frog({
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  basePath: "/api",
})

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

app.hono.post('/followers', async (c) => {
  try {
    let message = 'GM. Kenny rocks!'
    const body = await c.req.json()
    const result = await neynarClient.validateFrameAction(
      body.trustedData.messageBytes
    )
    // console.log(result.action.cast)

    if(!result.action.cast.author){
      return c.json({ message: "Person not found." })
    }

    const author = result.action.cast.author

    // const fid = Number(author.fid)
    // message = `Author FID: ${fid}`

    const eth_address_1 = author.verified_addresses.eth_addresses[0] || ''
    const eth_address_2 = author.verified_addresses.eth_addresses[1] || ''
    const eth_address_3 = author.verified_addresses.eth_addresses[2] || ''
    const sol_address_1 = author.verified_addresses.sol_addresses[0] || ''

    const nftId = 11

    const userDetails = {
      fid: author.fid,
      username : author.username,
      display_name : author.display_name || '',
      follower_count : author.follower_count,
      following_count : author.following_count,
      power_badge : author.power_badge,
      post_text : result.action.cast.text,
      post_timestamp : result.action.cast.timestamp,
      likes_count : result.action.cast.reactions.likes_count,
      recasts_count : result.action.cast.reactions.recasts_count,
      replies_count : result.action.cast.replies.count,
      eth_address_1,
      eth_address_2,
      eth_address_3,
      sol_address_1,
      nftId
    }

    



    // console.log(userDetails)

    // const { users } = await neynarClient.fetchBulkUsers([fid,])
    // // console.log(users)

    // if (!users) {
    //   return c.json({ message: "Error. User not found." }, 500)
    // }

    // const user = users[0]


    // const follower_count = user.follower_count
    // message = `Count: ${follower_count} .`

    message = `Scraped: ${userDetails.display_name}`


    // create an array from the values of the userDetails object
    const userDetailsArray: (number | string | boolean)[] = Object.values(userDetails)
    // append the array to the google sheet
    await appendToSheet(userDetailsArray)

    // await transferNft(nftId, eth_address_1)

    return c.json({ message })
  } catch (error) {
    console.error(error)
  }
})

app.use('/*', serveStatic({ root: './public' }))
devtools(app, { serveStatic })

if (typeof Bun !== 'undefined') {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  })
  console.log('Server is running on port 3000')
}
