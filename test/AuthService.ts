import { Amplify } from 'aws-amplify'
import { SignInOutput, fetchAuthSession, signIn} from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = 'ap-southeast-1'

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'ap-southeast-1_F2jczqg2f',
            userPoolClientId: '1fqqf0drgbkaadrtu8nkhu98ca',
            identityPoolId: 'ap-southeast-1:13f1f689-ecd4-44ed-a284-5845b6fa2a93'
        }
    }
})

export class AuthService {

    public async login(userName: string, password: string) {
        const signInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        });
        return signInOutput;
    }

    // call only after login
    public async getIdToken(){
        const authSession = await fetchAuthSession();
        return authSession.tokens?.idToken?.toString();
    }

    public async generateTemporaryCredentials (idToken: string){
        // const idToken = await this.getIdToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${awsRegion}_F2jczqg2f` // Identity providers name
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'ap-southeast-1:13f1f689-ecd4-44ed-a284-5845b6fa2a93',
                logins: {
                    [cognitoIdentityPool]: idToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials
    }

}