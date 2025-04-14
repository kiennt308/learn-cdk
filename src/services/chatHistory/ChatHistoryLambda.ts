import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getChatHistory } from "../model/GetChatHistory";
import { createChatHistory } from "./CreateChatHistory";
import { deleteChatHistory } from "./DeleteChatHistory";
import { MissingFieldError } from "../shared/Validator";
import { addCorsHeader } from "../../infra/Utils";

const ddbClient = new DynamoDBClient({ region: "ap-southeast-1" });

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    let response: APIGatewayProxyResult;

    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getChatHistory(event, ddbClient);
                console.log(getResponse);
                response = getResponse;
                break;
            case 'POST':
                const postResponse = await createChatHistory(event, ddbClient);
                console.log(postResponse);
                response = postResponse;
                break;
            case 'PUT':
                response = getResponse;
                break;
                // return updateChatHistory(event, context);
            case 'DELETE':
                const deleteResponse = await deleteChatHistory(event, ddbClient);
                console.log(deleteResponse);
                response = deleteResponse;
                break;
            default:
                break;
        }

        addCorsHeader(response);
    
        // const response: APIGatewayProxyResult = {
        //     statusCode: 200,
        //     body: JSON.stringify({
        //         message: message
        //     }),
        // }
    
        // return response
    } catch (error) {
        // console.log(JSON.stringify(error));
        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            }),
        }
    }

    addCorsHeader(response);
    
    return response
}

export { handler };