import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AttributeType, ITable, Table, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { getSuffixFromStack } from '../Utils'
import { Bucket, HttpMethods, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3'

export class DataStack extends Stack {
    public readonly chatHistoryTable: ITable
    public readonly deploymentBucket: IBucket
    public readonly imagesBucket: IBucket;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const suffix = getSuffixFromStack(this)

        this.deploymentBucket = new Bucket(this, 'DXFrontend', {
            bucketName: `dx-frontend-${suffix}`,
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false
            }
        })

        this.imagesBucket = new Bucket(this, 'DXImages', {
            bucketName: `dx-images-${suffix}`,
            cors: [{
                allowedMethods: [
                    HttpMethods.HEAD,
                    HttpMethods.GET,
                    HttpMethods.PUT
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*']
            }],
            // accessControl: BucketAccessControl.PUBLIC_READ, // currently not working,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false
            }
        });
        
        new CfnOutput(this, 'DXFrontendBucketName', {
            value: this.deploymentBucket.bucketName
        });

        new CfnOutput(this, 'DXImagesBucketName', {
            value: this.imagesBucket.bucketName
        });

        this.chatHistoryTable = new TableV2(this, 'ChatHistoryTable', {
            partitionKey: {
                name: 'messageId',
                type: AttributeType.STRING
            },
            tableName: `ChatHistoryTable-${suffix}`,
            globalSecondaryIndexes: [
                {
                    indexName: 'gsi1',
                    partitionKey: { name: 'senderId', type: AttributeType.STRING },
                    sortKey: { name: 'chatRoomId', type: AttributeType.STRING },
                },
                {
                    indexName: 'gsi3',
                    partitionKey: { name: 'chatRoomId', type: AttributeType.STRING },
                    sortKey: { name: 'createdAt', type: AttributeType.NUMBER },
                },
                {
                    indexName: 'gsi4',
                    partitionKey: { name: 'messageText', type: AttributeType.STRING },
                }
            ],
            removalPolicy: RemovalPolicy.DESTROY, // Only use for development environment
        })
    }
}
