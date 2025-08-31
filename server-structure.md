# ARC Copilot Server Structure

This document outlines the complete backend structure for ARC Copilot. Since Lovable only supports React frontends, this server would need to be deployed separately.

## 📁 Recommended File Structure

```
server/
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # Server entry point
│   ├── config/
│   │   ├── database.ts         # Supabase client setup
│   │   └── security.ts         # Security middleware config
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   ├── rbac.ts             # Role-based access control
│   │   ├── rateLimit.ts        # Rate limiting
│   │   └── validation.ts       # Input validation with Zod
│   ├── routes/
│   │   ├── ping.ts             # Health check endpoint
│   │   ├── submissions.ts      # Submission CRUD
│   │   ├── votes.ts            # Voting logic with jurisdiction checks
│   │   ├── uploads.ts          # File upload presigning
│   │   └── internal.ts         # Cron and internal endpoints
│   ├── services/
│   │   ├── database.ts         # Database operations
│   │   ├── fixtures.ts         # Fallback to static data
│   │   ├── compliance.ts       # AI compliance checking
│   │   ├── audit.ts            # Audit trail logging
│   │   └── encryption.ts       # Field-level encryption
│   ├── guards/
│   │   ├── jurisdiction.ts     # Meeting-aware governance
│   │   └── confidence.ts       # AI confidence thresholds
│   └── types/
│       ├── api.ts              # Request/response types
│       ├── compliance.ts       # Compliance checking types
│       └── audit.ts            # Audit event types
└── fixtures/                   # Static demo data (already created)
    ├── sample-submission-fence.json
    ├── sample-checklist-fence.json
    └── sample-letter-conditional.json
```

## 📦 Package.json Structure

```json
{
  "name": "arc-copilot-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "zod": "^3.22.4",
    "pino": "^8.16.1",
    "pino-http": "^8.5.1",
    "@supabase/supabase-js": "^2.38.4",
    "jsonwebtoken": "^9.0.2",
    "argon2": "^0.31.2",
    "nanoid": "^5.0.3",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "tsx": "^4.6.2",
    "typescript": "^5.3.3",
    "concurrently": "^8.2.2"
  }
}
```

## 🔐 Environment Variables (.env.example)

```bash
# Server Configuration
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=

# AI Services (Optional)
OPENAI_API_KEY=

# Security
APP_ENC_KEY=                    # 32-byte base64 key for AES-256-GCM
CRON_SECRET=                    # Random string for internal endpoints
JWT_SECRET=                     # For token verification

# Monitoring (Optional)
SENTRY_DSN=

# Antivirus (Production)
CLAMAV_HOST=
CLAMAV_PORT=3310
```

## 🛡 Security Implementation

### 1. Helmet Configuration
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 2. Rate Limiting
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 3. Input Validation
```typescript
const SubmissionSchema = z.object({
  projectType: z.string().min(1).max(100),
  fields: z.record(z.any()),
  // ... other fields
});
```

## 🔍 API Endpoints

### Core Routes
- `GET /api/ping` - Health check
- `GET /api/submissions/:id/checklist` - Compliance results
- `GET /api/submissions/:id/letter` - Draft letter
- `POST /api/votes/async` - Async voting with jurisdiction checks

### Upload Routes
- `POST /api/uploads/presign` - Generate presigned upload URL
- `POST /api/uploads/complete` - Complete upload and register metadata

### Internal Routes (CRON_SECRET required)
- `POST /internal/cron/sla-tick` - SLA monitoring
- `POST /internal/cron/retention-sweep` - Data retention cleanup

## 🏛 Jurisdiction Guards

```typescript
// Example: CA email vote blocking
if (community.state === "CA" && voteType === "email") {
  return res.status(400).json({
    error: "Email votes blocked in CA; schedule a meeting."
  });
}
```

## 📊 Audit Trail

Every state change generates an audit event:
```typescript
interface AuditEvent {
  org_id: string;
  actor_id: string;
  action: string;
  entity: string;
  entity_id: string;
  before_hash: string;
  after_hash: string;
  prev_hash: string;
  curr_hash: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}
```

## 🚀 Deployment Checklist

### Development
- [ ] Environment variables configured
- [ ] Supabase connection tested
- [ ] CORS configured for frontend URL
- [ ] Rate limiting enabled
- [ ] Input validation working

### Production
- [ ] HTTPS/TLS configured
- [ ] WAF/CDN in place
- [ ] Monitoring and alerting
- [ ] Backup strategy
- [ ] Incident response plan
- [ ] Secret rotation schedule

## 🔗 Integration with Lovable Frontend

The React app expects these environment variables:
```bash
VITE_API_BASE=http://localhost:4000  # Your server URL
```

And makes requests to:
- `/api/submissions/101/checklist`
- `/api/submissions/101/letter`

## ⚠️ Important Notes

1. **No Python/FastAPI**: Keep all logic in Express for this template
2. **Provider Agnostic**: Don't hardcode OpenAI - make AI providers swappable
3. **Fixtures Fallback**: Always fallback to static data if Supabase unavailable
4. **Human Approval**: Never send letters without explicit human approval
5. **Confidence Thresholds**: Enforce minimum confidence scores for PASS results
6. **Meeting Awareness**: Implement jurisdiction-specific governance rules

This structure provides a production-ready, secure backend that complements the React frontend while maintaining the human-in-the-loop safety requirements.
