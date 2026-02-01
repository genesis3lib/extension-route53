/**
 * Genesis3 Module Test Configuration - Route53 DNS Extension
 *
 * Tests the AWS Route53 DNS management including:
 * - SSL certificate automation workflows
 * - DNS record management
 * - AWS-specific CI/CD integration
 */

module.exports = {
  moduleId: 'extension-route53',
  moduleName: 'AWS Route53 DNS & SSL',

  scenarios: [
    {
      name: 'route53-ssl-workflows',
      description: 'Route53 with AWS - SSL certificate automation for client and server',
      config: {
        moduleId: 'route53',
        kind: 'extension',
        type: 'route53',
        providers: ['aws'],
        enabled: true,
        fieldValues: {}
      },
      expectedFiles: [
        '.github/workflows/Extension-210-client-ssl.yml',
        '.github/workflows/Extension-310-server-ssl.yml'
      ],
      fileContentChecks: [
        {
          file: '.github/workflows/Extension-210-client-ssl.yml',
          contains: [
            'Route53',
            'ACM',
            'certificate',
            'aws-actions/configure-aws-credentials'
          ]
        },
        {
          file: '.github/workflows/Extension-310-server-ssl.yml',
          contains: [
            'Route53',
            'ACM',
            'certificate',
            'aws-actions/configure-aws-credentials'
          ]
        }
      ]
    },
    {
      name: 'route53-with-react-spa',
      description: 'Route53 with React SPA on AWS - CloudFront SSL',
      config: {
        moduleId: 'route53-spa',
        kind: 'extension',
        type: 'route53',
        providers: ['aws', 'react'],
        enabled: true,
        fieldValues: {}
      },
      expectedFiles: [
        '.github/workflows/Extension-210-client-ssl.yml'
      ],
      fileContentChecks: [
        {
          file: '.github/workflows/Extension-210-client-ssl.yml',
          contains: [
            'CloudFront',
            'us-east-1'
          ]
        }
      ]
    },
    {
      name: 'route53-with-spring-backend',
      description: 'Route53 with Spring backend on AWS - ALB SSL',
      config: {
        moduleId: 'route53-backend',
        kind: 'extension',
        type: 'route53',
        providers: ['aws', 'spring'],
        enabled: true,
        fieldValues: {}
      },
      expectedFiles: [
        '.github/workflows/Extension-310-server-ssl.yml'
      ],
      fileContentChecks: [
        {
          file: '.github/workflows/Extension-310-server-ssl.yml',
          contains: [
            'ALB',
            'certificate-arn'
          ]
        }
      ]
    }
  ],

  templateValidations: [
    {
      name: 'uses-oidc-auth',
      template: 'extension-route53/cicd/.github/workflows/Extension-210-client-ssl.yml.mustache',
      contains: ['aws-actions/configure-aws-credentials', 'role-to-assume'],
      reason: 'Security: Should use OIDC for AWS authentication, not long-lived credentials'
    },
    {
      name: 'certificate-region-cloudfront',
      template: 'extension-route53/cicd/.github/workflows/Extension-210-client-ssl.yml.mustache',
      contains: ['us-east-1'],
      reason: 'CloudFront requires certificates in us-east-1 region'
    }
  ]
};
