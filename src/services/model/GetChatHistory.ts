import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

async function getChatHistory(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    // Get message with messageId from the query string parameters
    if (event.queryStringParameters) {
        if ('messageId' in event.queryStringParameters) {
            const chatHistoryId = event.queryStringParameters['messageId'];

            const getItemResponse = await ddbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'messageId': { S: chatHistoryId.toString() },
                    // 'createdAt': { N: '1744172591321' }
                }
            }));

            if (getItemResponse.Item) {
                // Remove attributes from the item
                const unmashalledItem = unmarshall(getItemResponse.Item);
                return {
                    statusCode: 200,
                    body: JSON.stringify(unmashalledItem),
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: `Message with messageId ${chatHistoryId} not found`
                    }),
                }
            }


        }
    }

    // Scan ChatHistory from the database (DynamoDB)
    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME
    })); // cannot read properties of undefined (reading '0') dynamodb

    const unmarshalledItems = result.Items?.map(item => unmarshall(item));

    const response = {
        statusCode: 201,
        body: JSON.stringify(unmarshalledItems),
    };

    return response;
}

export { getChatHistory };