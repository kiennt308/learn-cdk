import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsMessageEntry } from "../shared/Validator";

async function createChatHistory(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const uuid = v4();

    const body = JSON.parse(event.body || '{}');

    if (body) {
        // console.log("🚀 ~ createChatHistory ~ body:", body)
        // const item = {
        //     messageId: { S: uuid },
        //     chatRoomId: { S: body['chatRoomId'] },
        //     createdAt: { N: body['createdAt'] },
        //     senderId: { S: body['senderId'] },
        //     messageText: { S: body['messageText'] },
    
        // }

        const item = body;
        item['messageId'] = uuid;
        validateAsMessageEntry(item)

        // Save the ChatHistory to the database (DynamoDB)
        const result = await ddbClient.send(new PutItemCommand({
            TableName: process.env.TABLE_NAME,
            Item: marshall(item), // Dynamo DB v3
        })); // cannot read properties of undefined (reading '0') dynamodb
    
        // console.log(result);
    
        const response = {
            statusCode: 201,
            body: JSON.stringify({ messageId: uuid }),
        };
    
        return response;
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing body'
            }),
        }
    }

}

export { createChatHistory };