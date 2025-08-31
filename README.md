# ARC Copilot

AI-powered architectural review and compliance engine for HOA communities. Streamline decision-making with clause-cited assessments and automated compliance checking.

## 🚀 Live Demo

Visit the [live demo](/) to see ARC Copilot in action, or check out the [detailed compliance demo](/demo) showing a fence approval workflow.

## 📋 Project Overview

ARC Copilot is designed to:
- **Reduce cycle time by ≥40%** on ARC decisions vs. baseline
- **Cut email back-and-forth by ≥50%** per request
- Provide **clause-cited compliance** with confidence scores
- Enforce **meeting-aware governance** with jurisdiction-specific rules
- Maintain **human-in-the-loop** safety with required approval workflows

## 🏗 Architecture

### Frontend (React + Vite + TypeScript + Tailwind)
- Professional legal/government design system
- Compliance status visualization with clause citations
- Draft letter generation with human review requirements
- Jurisdiction-aware warnings (e.g., CA meeting requirements)

### Backend Requirements (Not Included in Lovable)

**Important**: Lovable can only host the React frontend. For the complete ARC Copilot system, you'll need to set up the backend separately or use Supabase integration.

#### Recommended Stack:
```
server/ (Express + TypeScript)
├── Security: Helmet, CORS, rate limiting, input validation
├── Auth: OIDC JWT (Auth0/Clerk) with RBAC
├── Database: Supabase with RLS policies
├── Storage: Presigned URL uploads with antivirus scanning
├── Audit: Append-only audit trail for compliance
└── AI: Optional OpenAI integration for compliance checking
```

## 🔧 Setup Options

### Option 1: Use Supabase Integration (Recommended)

1. Click the green **Supabase** button in the top right of the Lovable interface
2. Connect to your Supabase project
3. Run the provided SQL files:
   - `supabase/schema.sql` - Database schema with RLS
   - `supabase/seed.sql` - Demo data
   - `supabase/storage_policies.sql` - File upload policies

This enables:
- User authentication
- Database storage with row-level security
- File uploads
- Backend API functions

### Option 2: External Backend

If you need the full Express backend with advanced features:

1. Set up Express server with the security requirements listed above
2. Configure CORS to allow your Lovable frontend URL
3. Implement the API endpoints:
   - `GET /api/ping`
   - `GET /api/submissions/:id/checklist`
   - `GET /api/submissions/:id/letter`
   - `POST /api/votes/async` (with jurisdiction checks)

### Option 3: Demo Mode (Current)

The app currently runs in demo mode with static fixtures data, perfect for:
- Showcasing the UI/UX
- Understanding the compliance workflow
- Testing the design system

## 📊 Demo Data

The `/demo` page shows a sample fence submission with:

### Submission Details
- **Property**: Lot 23, 114 Mockingbird Ln
- **Community**: Mockingbird Hills HOA (TX)
- **Project**: 7-foot wood board-on-board fence

### Compliance Results
1. **FAIL**: Height exceeds 6-foot maximum (§4.3(b))
2. **PASS**: Wood material is approved (§4.3(c))
3. **NEEDS INFO**: Missing neighbor notice (Appendix A)

### Key Features Demonstrated
- Clause-cited assessments with confidence scores
- Status-based visual indicators
- Draft decision letter generation
- Jurisdiction-aware warnings
- Human review requirements

## 🎨 Design System

Professional navy-based palette optimized for legal/government use:
- **Primary**: Deep navy for authority and trust
- **Success**: Green for approved items
- **Warning**: Amber for items needing attention
- **Destructive**: Red for rejected items
- **Info**: Blue for informational content

## 🔒 Security & Compliance

- **Privacy by default** with field-level encryption
- **Audit trail** for all state changes
- **Meeting-aware governance** enforcing jurisdiction rules
- **Human approval required** for all decisions
- **Confidence thresholds** preventing low-quality assessments

## 📈 Non-Negotiable Outcomes

1. **Cycle time ↓ ≥40%** on ARC decisions vs. baseline
2. **Email back-and-forth ↓ ≥50%** per request
3. **Every automated claim** grounded in quoted clause with confidence score
4. **Human-in-the-loop**: No letter sent without human approval
5. **Meeting-aware**: Block illegal board actions, enforce notice/quorum
6. **Accommodation fast lane** following HUD/DOJ guidance
7. **Privacy-by-default** and jurisdiction-aware legal guardrails

## 🚫 Important Limitations

- No claims of "100% error-free" or legal advice
- All outputs clearly labeled as drafts requiring human review
- Confidence thresholds and source citations mandatory
- Jurisdiction-specific guardrails (e.g., CA meeting requirements)

## 📝 User Roles

- **Community Manager**: Day-to-day operations
- **ARC Chair/Board**: Decision making and approvals
- **Owner**: Submission and status tracking
- **Contractor**: Professional submissions
- **Counsel**: Read-only compliance review
- **Org Admin**: System configuration

## 🔗 Integration Philosophy

ARC Copilot is designed to be **integration-light**, working alongside existing HOA management systems (Smartwebs, PayHOA, Vantaca, CINC) without requiring replacement.

## 📞 Next Steps

1. **Explore the demo** to understand the compliance workflow
2. **Connect to Supabase** for backend functionality
3. **Customize** the design system for your community branding
4. **Configure** jurisdiction-specific rules and regulations
5. **Train** your team on the human-in-the-loop approval process

---

**Legal Notice**: ARC Copilot provides regulatory guidance but does not constitute legal advice. All decisions require human review and approval. Built for HOA professionals by compliance experts.