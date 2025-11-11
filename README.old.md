# IC - Intellectual Collaboration Platform
Igloo Replacement Project

## Project Charter
**IC CMS Web and Mobile Application**  
Phase 1 Web. Phase 2 Mobile.

### Purpose
Design and deploy a unified web and mobile system on AWS so authenticated users can access, post, and manage content, communicate in groups, and collaborate securely across desktop and mobile.

### Background
Replacing Igloo with a custom AWS CMS for 50,000+ users. The new platform increases engagement, usability, and communication for students, faculty, staff, and external collaborators.

### Objectives
- Build a responsive web app now, plan cross-platform mobile apps next.
- Provide secure, real-time access to CMS features.
- Improve UX with intuitive navigation, notifications, and optional offline support.
- Integrate cleanly with AWS services.
- Ensure data portability. No data dead-ends.

## Scope
**In scope:** Web app, future mobile apps, authz and authn, content browsing and posting, file upload, group communication, notifications, AWS integrations, admin tools.  
**Out of scope:** Re-design of CMS backend, legacy Igloo maintenance.

## Business Drivers
Increase engagement and accessibility, streamline group communication and content sharing, modernize technology, reduce application costs, and deliver a solution tailored to the Doctoral College and broader university needs.

## Key Stakeholders
Sponsor: Garron Hale, Campus Technology Leadership  
Product Owner: Campus Technology  
Users: Students, Faculty, Staff, External collaborators  
Team: Campus Technology, Capstone Student Developers

## Benefits
- Higher engagement and satisfaction
- Better efficiency through integrations
- Competitive digital campus services
- Lower long-term application costs

## Success Criteria
- Web launch on schedule
- 99.9% uptime on AWS
- 25,000+ active users year one
- 80%+ user satisfaction

## Constraints and Risks
- Compliance: FERPA and GDPR, university security policies
- Risks: integration complexity, resource limits, UX variability across platforms

## Milestones and Timeline (target 2025)
- Requirements Finalization: 5/2 to 5/7  
- Architecture and Diagrams: 5/8 to 5/12  
- AWS Infrastructure Setup: 5/13 to 5/20  
- Cognito Auth: 5/21 to 5/26  
- Frontend MVP (S3 + CloudFront): 5/27 to 6/3  
- API (API Gateway + Lambda): 6/4 to 6/14  
- Databases (RDS + DynamoDB): 6/15 to 6/19  
- Groups and Roles: 6/20 to 6/26  
- Content Posting: 6/27 to 7/3  
- Forum and Messaging: 7/4 to 7/9  
- Admin Dashboard: 7/10 to 7/15  
- Reporting and Metrics: 7/16 to 7/21  
- Push Notifications: 7/22 to 7/25  
- Testing and QA: 7/26 to 8/2  
- Deployment and Monitoring: 8/3 to 8/7  
- Training and Docs: 8/8 to 8/12

## Estimated Resources
PM, BA, UX, 2 Web Devs, AWS Architect, 2 QA, Security, IT Support post-launch, Training and Docs.

## High-Level Architecture
- **Frontend:** React on S3 + CloudFront. Managed with AWS Amplify and Amplify Studio.
- **Auth:** Amazon Cognito user pools and groups.
- **APIs:** API Gateway + Lambda.
- **Data:** RDS for relational data, DynamoDB for scalable metadata and forum content, S3 for files.
- **Search:** OpenSearch Service.
- **Notifications:** SNS and SES.
- **Analytics and Monitoring:** CloudWatch, QuickSight.
- **Security:** IAM, WAF, Shield, KMS, Config, CloudTrail.
- **CI/CD:** Amplify Hosting or CodePipeline + CodeBuild. GitHub Actions optional.

## System Interactions
1. User signs in with Cognito and receives tokens.  
2. Frontend calls API Gateway with Cognito authorizer.  
3. Lambda reads and writes to DynamoDB, RDS, and S3.  
4. SNS and SES deliver notifications.  
5. OpenSearch indexes content for discovery.

## MVP Requirements
- Sign up, login, password reset
- Group creation and membership
- Role-based access control
- Basic content creation and file upload
- Basic forums or messaging
- Admin tools for users, groups, content
- Responsive UI and metrics for admins and committees
- Opt-in notifications

**Non-functional:** 99.9% uptime, HTTPS everywhere, encryption at rest and in transit, scalability to 50k concurrent users, data export capability, FERPA and GDPR readiness.

## Roles and Permissions
- Application Admin: full platform management
- Group Admin: manage group membership, content, and settings
- Group Officer: delegated moderation and content duties
- Faculty, Student, Off-campus, Guest: scoped capabilities by role and group

## Project Plan Highlights
1. Initiation and stakeholder alignment  
2. Requirements and current state analysis of Igloo  
3. Architecture design and diagrams  
4. Build: infrastructure, auth, core features, integrations  
5. Testing: unit, integration, security, performance, UAT  
6. Optional data migration from Igloo  
7. Deployment and go-live with cutover plan  
8. Training and support  
9. Closeout and lessons learned

## Cost if External Vendor
Estimated total: 1,777,500 USD including staff, AWS services, tools, and contingency.

## Mobile Approach
React Native or Flutter consuming the same AWS backend. Push via SNS to APNs and FCM. Optional PWA for faster delivery.

## Assumptions and Dependencies
- SSO provided by University IT as needed
- Timely stakeholder feedback
- AWS backend and accounts provisioned

## Update
Minor edit from feature/madalina branch.
