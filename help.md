# AWS Route53 DNS & SSL

This extension adds automatic DNS management using AWS Route53 and SSL certificate automation through AWS Certificate Manager (ACM). Your application's domain names and security certificates are managed automatically.

## What This Does

When you deploy your application, this extension:
- Automatically creates DNS records pointing your domain to your application
- Generates and renews SSL certificates so your site uses HTTPS
- Manages everything through GitHub Actions workflows

## Prerequisites

Before using this extension:
1. You must have an AWS account
2. Your domain must be registered (can be on any registrar like GoDaddy, Namecheap, etc.)
3. You need to create a Route53 Hosted Zone for your domain in AWS

## How to Set Up Route53 Hosted Zone

### Step 1: Create Hosted Zone

1. **Log into AWS Console**: Go to https://console.aws.amazon.com
2. **Navigate to Route53**: Search for "Route53" in the top search bar and click it
3. **Create Hosted Zone**:
   - Click "Create hosted zone" button
   - Enter your domain name (e.g., `myapp.com`)
   - Keep "Public hosted zone" selected
   - Click "Create hosted zone"

### Step 2: Update Domain Nameservers

After creating the hosted zone, AWS gives you 4 nameservers (they look like `ns-123.awsdns-45.com`).

1. **Copy the nameservers**: You'll see them listed in your hosted zone
2. **Update your domain registrar**:
   - Log into your domain registrar (GoDaddy, Namecheap, etc.)
   - Find DNS settings or nameserver settings
   - Replace existing nameservers with the 4 AWS nameservers
   - Save changes

**Note**: Nameserver changes can take 24-48 hours to propagate globally.

### Step 3: Verify Setup

After nameservers have propagated:
- Go back to Route53 in AWS Console
- You should see your hosted zone
- Note down the **Hosted Zone ID** (looks like `Z1234567890ABC`)

---

## Configuration Fields

### Runtime Configuration

#### Route53 Hosted Zone ID `ROUTE53_HOSTED_ZONE_ID`
**What it is**: A unique identifier for your Route53 hosted zone. This tells AWS which domain's DNS records to manage.

**How to find it**:
1. Log into AWS Console
2. Go to Route53 → Hosted zones
3. Click on your domain name
4. Look for "Hosted zone ID" at the top right
5. Copy the ID (format: `Z` followed by letters and numbers)

**Format**: Starts with `Z` followed by 13 alphanumeric characters

**Example**: `Z1234567890ABC` or `ZPH6EXAMPLE123`

**When to use**: Required if you want automatic DNS management. Leave empty if you'll manage DNS manually.

---

## How It Works

### DNS Records
When you deploy your application, GitHub Actions workflows will:
1. Create/update A records pointing your domain to your application
2. Create CNAME records for subdomains (e.g., `www.myapp.com`, `api.myapp.com`)
3. All DNS changes happen automatically during deployment

### SSL Certificates
The extension also:
1. Requests SSL certificates from AWS Certificate Manager (ACM)
2. Validates domain ownership automatically via DNS
3. Installs certificates on your application
4. Renews certificates before they expire

You don't need to do anything - it's all automatic!

---

## Common Issues

### "Hosted Zone Not Found"
**Problem**: The workflow can't find your Route53 hosted zone.

**Solution**:
- Verify the Hosted Zone ID is correct (check AWS Console → Route53)
- Ensure your AWS credentials have Route53 permissions
- Check that the hosted zone exists in the correct AWS region

### "Domain Not Verified"
**Problem**: SSL certificate validation fails.

**Solution**:
- Make sure your domain nameservers point to AWS Route53
- Wait 24-48 hours after changing nameservers
- Use `nslookup yourdomain.com` to verify nameservers are updated

### "Access Denied"
**Problem**: GitHub Actions can't access Route53.

**Solution**:
- Verify AWS credentials are set up in GitHub Secrets
- Check IAM permissions include `route53:ChangeResourceRecordSets` and `acm:RequestCertificate`
- Ensure the AWS user/role has access to your hosted zone

---

## Manual DNS Alternative

If you prefer to manage DNS manually:
- Leave `ROUTE53_HOSTED_ZONE_ID` empty
- The extension will skip automatic DNS management
- You'll need to create DNS records manually in your registrar's control panel

---

## Additional Resources

- **AWS Route53 Documentation**: https://docs.aws.amazon.com/route53/
- **Route53 Pricing**: https://aws.amazon.com/route53/pricing/
- **ACM Documentation**: https://docs.aws.amazon.com/acm/
- **Nameserver Propagation Checker**: https://www.whatsmydns.net/

## Support

If you need help:
- AWS Route53 Support: https://aws.amazon.com/premiumsupport/
- AWS Route53 Forums: https://forums.aws.amazon.com/forum.jspa?forumID=87
