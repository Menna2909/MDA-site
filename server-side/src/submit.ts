import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Database setup
const submissionDB = {
  IPs: new Set<string>(),
  Emails: new Set<string>(),
  Submissions: new Map<string, Set<string>>()
};

// Configure CORS for production
const corsOptions = {
  origin: [
    'https://mdawebsite.netlify.app' // Production frontend only
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(express.json());
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// API endpoint
app.post('/submit', async (req: Request, res: Response) => {
  // ... (keep your existing submit logic)
});

// Improved health check
app.get('/health', (req, res) => {
  const serverInfo = {
    status: 'OK',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    railwayPublicDomain: process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set'
  };
  res.status(200).json(serverInfo);
});

// Start server with explicit host binding
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running:');
  console.log(` - Local: http://localhost:${PORT}`);
  console.log(` - Network: http://0.0.0.0:${PORT}`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {  // Fixed typo in variable name
    console.log(` - Public URL: ${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
});