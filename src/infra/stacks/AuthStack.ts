import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { Effect, FederatedPrincipal, PolicyStatement, Role, User } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { getSuffixFromStack } from '../Utils';
import { IBucket } from 'aws-cdk-lib/aws-s3';

interface AuthStackProps extends StackProps {
    imagesBucket: IBucket
}

export class AuthStack extends Stack {
    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    private adminRole: Role;

    constructor(scope: Construct, id: string, props: AuthStackProps) {
        super(scope, id, props)

        this.createUserPool()
        this.createUserPoolClient()
        this.createIdentityPool()
        this.createRoles(props.imagesBucket);
        this.attachRoles();
        this.createAdminsGroup()
    }

    private createUserPool() {
        const suffix = getSuffixFromStack(this)

        this.userPool = new UserPool(this, 'DXUserPool', {
            userPoolName: `DXUserPool-${suffix}`,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                username: true,
            },
            
        })

        new CfnOutput(this, 'DXUserPoolId', {
            value: this.userPool.userPoolId
        })
    }

    private createUserPoolClient() {
        this.userPoolClient = new UserPoolClient(this, 'DXUserPoolClient', {
            userPool: this.userPool,
            authFlows: {
                adminUserPassword: true,
                userPassword: true,
                userSrp: true,
                custom: true,
            },
            preventUserExistenceErrors: true,
        })

        new CfnOutput(this, 'DXUserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        })
    }

    private createAdminsGroup(){
        new CfnUserPoolGroup(this, 'DXAdmins', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins',
            roleArn: this.adminRole.roleArn
        })
    }

    private createIdentityPool(){
        this.identityPool = new CfnIdentityPool(this, 'DXIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        })

        new CfnOutput(this, 'DXIdentityPoolId', {
            value: this.identityPool.ref
        })
    }

    private createRoles(imagesBucket: IBucket){
        this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });
        
        this.adminRole = new Role(this, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.adminRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:PutObject',
                's3:PutObjectAcl',
            ],
            resources: [imagesBucket.bucketArn + '/*']
        }))
    }

    private attachRoles(){
        new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unAuthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }
}
