import { Authorization } from "aws-cdk-lib/aws-events";
import { handler } from "../src/services/chatHistory/ChatHistoryLambda";
import { v4 } from "uuid";

process.env.AWS_REGION = "ap-southeast-1";
process.env.TABLE_NAME = 'ChatHistoryTable-0a8634cab72d'

handler({
    httpMethod: 'POST',
    Authorization: 'eyJraWQiOiJkd2U0cE1YS1puTVpJYmd4SVBVR2F1NkFWamsrVWt6T08wdGd6S3BNSDdjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4OWRhNDViYy1jMDIxLTcwMjEtNTI0OC0xMTA4YzRiNGE4MDkiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbnMiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aGVhc3QtMV9GMmpjenFnMmYiLCJjb2duaXRvOnVzZXJuYW1lIjoidHJpbmhjaGF0Ym90Iiwib3JpZ2luX2p0aSI6ImJhODc3MWM5LTQzYTktNDgzZC05Yjc0LThmNDdiN2IwYWE2MCIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjkzNTM2NDAwODA1MTpyb2xlXC9BcHBsaWNhdGlvblN0YWNrQXV0aFN0YWNrQS1Db2duaXRvQWRtaW5Sb2xlNEMxMEZCQTQtNU9kNFNqU1BlWDcyIl0sImF1ZCI6IjFmcXFmMGRyZ2JrYWFkcnR1OG5raHU5OGNhIiwiZXZlbnRfaWQiOiI4MDQyZDRjMS0wMzUwLTQyMzMtYWYxYi04ZjZiOTBmZTFkYzYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDM0NjQwMSwiZXhwIjoxNzQ0MzUwMDAxLCJpYXQiOjE3NDQzNDY0MDEsImp0aSI6IjVkNGY2YTcyLTJmYWItNGMyOS05MzhkLWIyOGVlZWFmZjM3ZSIsImVtYWlsIjoiZGFuZ3RyaW5oLmRldkBnbWFpbC5jb20ifQ.Tb7gxQb79jpDs7zG02XPtWde1eIJkJ1aFXjWLdvctMx_hPtZp04IUce96Ff8Ioo5vTkumNwoYYLbLOsxtj-3LsT79PhacEKioTPYwtU7Km8WuKm9u2c1EQdDX33kwitxwM9CwGx2chkP3aYvi9rfw9olA1zShISlxuU73LsHq2s1p7MhJKyEym_Y-gjzEO6T0i9R8_SYlxvl3m3W3gB3z3ovCG7ft_UVwhOizX6ndomS3RDLASzDvN2Vz8Gosa38xNdPdLF2ET3vmt8UicljVa23AuS0Q9h5-JMP2oH8yNTauAvp7YbZ0vlOPn_efVLDBz3ZB3aeipN-iuRyAW335Q',
    // queryStringParameters: {
    //     messageId: 'd001da18-1be1-468a-acfe-ecbeaeabddcb'
    // }
    body: JSON.stringify({
        createdAt: Date.now(),
        chatRoomId: v4(),
        senderId: v4(),
        messageText: "Ngày mai làm thế nào để được nghỉ?"
    })
} as any, {} as any)
// .then(result => {
//     console.log(result)
// });

// ts-node test/launcher.ts