import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { ITable } from 'aws-cdk-lib/aws-dynamodb'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

interface LambdaStackProps extends StackProps {
    chatHistoryTable: ITable
}

export class LambdaStack extends Stack {
    public readonly chatHistoryLambdaIntegration: LambdaIntegration

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props)

        // chatHistory Lambda
        const chatHistoryLambda = new NodejsFunction(this, 'chatHistoryLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'handler',
            entry: (join(__dirname, '..', '..', 'services', 'chatHistory', 'chatHistoryLambda.ts')),
            environment: {
                TABLE_NAME: props.chatHistoryTable.tableName
            }
        })

        console.log("props.chatHistoryTable.tableArn: ", props.chatHistoryTable.tableArn)

        chatHistoryLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'dynamodb:PutItem',
                'dynamodb:Scan',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
            ],
            resources: [props.chatHistoryTable.tableArn]
        }))

        this.chatHistoryLambdaIntegration = new LambdaIntegration(chatHistoryLambda)
    }

}
