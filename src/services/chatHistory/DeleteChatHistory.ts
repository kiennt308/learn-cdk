import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../shared/Validator";

async function deleteChatHistory(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    if (!hasAdminGroup(event)) {
        return {
            statusCode: 401,
            body: JSON.stringify(`Not authorized!`)
        }
    }
    
    // Get message with messageId from the query string parameters
    if(event.queryStringParameters && ('messageId' in event.queryStringParameters)) {

        const messageId = event.queryStringParameters['messageId'];

        const result = await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'messageId': {S: messageId}
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    }
    
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide message info to delete !')
    }
}

export { deleteChatHistory };