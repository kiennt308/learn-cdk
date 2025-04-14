import { App, Stack, StackProps } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { Construct } from "constructs";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";

const app = new App();
// const dataStack = new DataStack(app, 'DataStack');

// const lambdaStack = new LambdaStack(app, 'LambdaStack', {
//     chatHistoryTable: dataStack.chatHistoryTable
// });

// const authStack = new AuthStack(app, 'AuthStack');

// const apiStack = new ApiStack(app, 'ApiStack', {
//     chatHistoryLambdaIntegration: lambdaStack.chatHistoryLambdaIntegration,
//     userPool: authStack.userPool
// });



export class AppicationStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Instantiate the individual stacks
        const dataStack = new DataStack(this, 'DataStack');
        const lambdaStack = new LambdaStack(this, 'LambdaStack', {
            chatHistoryTable: dataStack.chatHistoryTable
        });

        const authStack = new AuthStack(this, 'AuthStack',{
            imagesBucket: dataStack.imagesBucket
        });

        const apiStack = new ApiStack(this, 'ApiStack', {
            chatHistoryLambdaIntegration: lambdaStack.chatHistoryLambdaIntegration,
            userPool: authStack.userPool
        });

        const uiDeploymentStack = new UiDeploymentStack(app, 'UiDeploymentStack', {
            deploymentBucket: dataStack.deploymentBucket
        })

        // Add resources from individual stacks to the combined stack
        this.addDependency(dataStack);
        this.addDependency(lambdaStack);
        this.addDependency(authStack);
        this.addDependency(apiStack);
        this.addDependency(uiDeploymentStack);
    }
}

const applicationStack = new AppicationStack(app, 'ApplicationStack');


// depend on
// addDependency

// dataStack.addDependency(lambdaStack);
// lambdaStack.addDependency(apiStack);
// apiStack.addDependency(authStack);