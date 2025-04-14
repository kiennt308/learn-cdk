import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { IUserPool } from 'aws-cdk-lib/aws-cognito'

interface ApiStackProps extends StackProps {
    chatHistoryLambdaIntegration: LambdaIntegration,
    userPool: IUserPool
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props)

        const api = new RestApi(this, 'chatHistoryApi')
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'ChatHistoryApiAuthorizer', {
            cognitoUserPools:[props.userPool],
            identitySource: 'method.request.header.Authorization'
        });
        authorizer._attachToApi(api);

        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }
        // const chatHistoryResource = api.root.addResource('chatHistory') // api endpoint

        const optionsWithCors: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        const chatHistoryResource = api.root.addResource('chatHistory', optionsWithCors); // api endpoint
        
        chatHistoryResource.addMethod('GET', props.chatHistoryLambdaIntegration, optionsWithAuth)
        chatHistoryResource.addMethod('POST', props.chatHistoryLambdaIntegration, optionsWithAuth)
        chatHistoryResource.addMethod('PUT', props.chatHistoryLambdaIntegration, optionsWithAuth)
        chatHistoryResource.addMethod('DELETE', props.chatHistoryLambdaIntegration, optionsWithAuth)

        // Other APIs
    }

}
