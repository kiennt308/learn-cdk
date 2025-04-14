import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { AccessLevel, Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";


interface UiDeploymentStackProps extends StackProps {
    deploymentBucket: IBucket;
}

export class UiDeploymentStack extends Stack {

    constructor(scope: Construct, id: string, props: UiDeploymentStackProps) {
        super(scope, id, props);

        // const suffix = getSuffixFromStack(this);

        // const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
        //     bucketName: `dx-frontend-${suffix}`
        // });

        const uiDir = join(__dirname, '..', '..', 'DX-frontend', 'dist');
        // if (!existsSync(uiDir)) {
        //     console.warn('Ui dir not found: ' + uiDir);
        //     return;
        // }

        if (existsSync(uiDir)) {
            new BucketDeployment(this, 'dx-ui-deployment', {
                destinationBucket: props.deploymentBucket,
                sources: [
                    Source.asset(uiDir)
                ]
            })

            new CfnOutput(this, 'DX-ui-deploymentS3Url', {
                value: props.deploymentBucket.bucketWebsiteUrl
            })
        } else {
            console.warn('Ui directory not found: ' + uiDir)
        }

        // new BucketDeployment(this, 'ChatHistoryFinderDeployment', {
        //     destinationBucket: props.deploymentBucket,
        //     sources: [Source.asset(uiDir)]
        // });

        // const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
        // props.deploymentBucket.grantRead(originIdentity);

        // const s3Origin = S3BucketOrigin.withOriginAccessControl(props.deploymentBucket, {
        //     originAccessLevels: [AccessLevel.READ],
        // });

        // const distribution = new Distribution(this, 'ChatHistoryFinderDistribution', {
        //     defaultRootObject: 'index.html',
        //     defaultBehavior: {
        //         origin: s3Origin
        //     }
        // });

        // new CfnOutput(this, 'ChatHistoryPageUrl', {
        //     value: distribution.distributionDomainName
        // })
    }


}