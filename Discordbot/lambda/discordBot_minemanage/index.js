import {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} from "discord-interactions";
import { Lambda } from "@aws-sdk/client-lambda";

const verifyRequest = (event) => {
    const { headers, body } = event
    const signature = headers['x-signature-ed25519']
    const timestamp = headers['x-signature-timestamp']
    const publicKey = process.env.DISCORD_PUBLIC_KEY
    if (!body || !signature || !timestamp || !publicKey) {
        return false
    }
    return verifyKey(body, signature, timestamp, publicKey)
}


const region = 'ap-northeast-1';
const lambda = new Lambda({ region });

const StartEC2InstancesFunction = async() => {
    const StartEC2Instances = process.env.START_EC2_INSTANCES_LAMBDA
  
    try {
        const params = {
            FunctionName: StartEC2Instances,
            InvocationType: 'Event',
        };

        const response = await lambda.invoke(params)
        return 'Starting the server now.'
    } catch (error) {
        return 'Something went wrong.'
    }
}

const StopEC2InstancesFunction = async() => {
    const StopEC2Instances = process.env.STOP_EC2_INSTANCES_LAMBDA
    
    try {
        const params = {
            FunctionName: StopEC2Instances,
            InvocationType: 'Event',
        };

        const response = await lambda.invoke(params)
        return 'Stopping the server now.'
    } catch (error) {
        return 'Something went wrong.'
    }
}

const StatusEC2InstancesFunction = async(interaction) => {
    const StatusEC2Instances = process.env.STATUS_EC2_INSTANCES_LAMBDA
    
    try {
        // 非同期で実行して、リクエスト先の処理内のWebhookでレスポンスを編集する
        const params = {
            FunctionName: StatusEC2Instances,
            InvocationType: 'Event',
            Payload: Buffer.from(
                JSON.stringify({
                    interaction,
                })
            ),
      
        };
    
        const response = await lambda.invoke(params)
      
        return 'Checking server status.'
    } catch (error) {
        return 'Something went wrong.'
    }
}
  
const handleInteraction = async(interaction) => {
  
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const channelId = process.env.CHANNEL_ID
        if (channelId !== interaction.channel_id) {
            // 特定のチャネルからのリクエストしか受け付けない
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Requests from this channel are forbidden'
                },
            }
        }

        const { data } = interaction
        let resContent
        
        switch (data.options[0].value) {
            case 'start':
                resContent = await StartEC2InstancesFunction()
                break;
            case 'stop':
                resContent = await StopEC2InstancesFunction()
                break;
            case 'status':
                resContent = await StatusEC2InstancesFunction(interaction)
                break;
            default:
                resContent = 'Something went wrong.'
        }

        if (data.options[0].value === 'status') {
            // 処理結果を送信したいので、先に返答しておいて後でメッセージ送信する
            return {
                type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            };
        }
        
        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: resContent
            },
        }


    } else {
        return {
            type: InteractionResponseType.PONG,
        }
    }
}

export const handler = async (event) => {
    if (!verifyRequest(event)) {
        return {
            statusCode: 400,
        }
    }

    const { body } = event
    const interaction = JSON.parse(body)
    // console.log(interaction)

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(await handleInteraction(interaction)),
    }
}
