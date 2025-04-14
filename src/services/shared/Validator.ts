import { APIGatewayProxyEvent } from "aws-lambda";
import { MessageEntry } from "../model/Model";

export class MissingFieldError extends Error {
    constructor(missingField: string) {
        super(`Value for ${missingField} expected!`)
    }
}

export function validateAsMessageEntry(arg: any){
    if ((arg as MessageEntry).messageId == undefined) {
        throw new MissingFieldError('messageId')
    }

    if ((arg as MessageEntry).chatRoomId == undefined) {
        throw new MissingFieldError('chatRoomId')
    }

    if ((arg as MessageEntry).createdAt == undefined) {
        throw new MissingFieldError('createdAt')
    }

    if ((arg as MessageEntry).senderId == undefined) {
        throw new MissingFieldError('senderId')
    }

    if ((arg as MessageEntry).messageText == undefined) {
        throw new MissingFieldError('messageText')
    }
}

// Check if has admin group
export function hasAdminGroup(event: APIGatewayProxyEvent){
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    console.log("🚀 ~ hasAdminGroup ~ groups:", groups)
    if (groups) {
        return (groups as string).includes('admins');
    }
    return false;
}