// comfirm password
// aws cognito-idp admin-set-user-password --user-pool-id ap-southeast-1_xJTktM2Re --username kien_manager --password "SeniorManager6868." --permanent
// ts-node test/auth.test.ts
import { log } from "console";
import { AuthService } from "./AuthService";
import { fetchAuthSession } from "@aws-amplify/auth";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'trinhchatbot',
        '@Cloudeng1605.'
    )
    console.log(loginResult);

    if (loginResult.isSignedIn) {
        console.log("Login successful");
        const userSession = await fetchAuthSession();
        const idToken = userSession.tokens?.idToken?.toString();
        console.log("🚀 ~ testAuth ~ idToken:", idToken)

        const credentials = await service.generateTemporaryCredentials(idToken);
        console.log("🚀 ~ testAuth ~ credentials:", credentials)
        const buckets = await listBuckets(credentials);
        console.log("🚀 ~ testAuth ~ buckets:", buckets)
    }

    async function listBuckets(credentials: any) {
        const client = new S3Client({
            credentials: credentials
        });
        const command = new ListBucketsCommand({});
        const result = await client.send(command);
        return result;
    }
}

testAuth();