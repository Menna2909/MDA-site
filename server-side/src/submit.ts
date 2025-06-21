import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
// const PORT = 'https://mda-site-production.up.railway.app/submit';
const PORT = process.env.PORT || 3000;

// Database structure: 
// {
//   IPs: Set<string> (all unique IPs),
//   Emails: Set<string> (all unique emails),
//   Submissions: Map<IP, Set<Emails>> (track which IP used which emails)
// }
const submissionDB = {
  IPs: new Set<string>(),
  Emails: new Set<string>(),
  Submissions: new Map<string, Set<string>>() // IP -> Set<Emails>
};

app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://mdawebsite.netlify.app/'], // Replace with your frontend URL
  methods: ['POST'],
  credentials: true
}));

app.post('/submit', async (req: Request, res: Response) : Promise<void> => {
  try {
    const { email } = req.body;
    const ip = req.ip || req.socket.remoteAddress;

    // Validate input
    if (!email || !ip) {
      console.log('Missing email or IP');
      res.status(400).json({ 
        canSubmit: false,
        reason: 'Missing email or IP address' 
      });
      return;
    }

    // Check if email exists globally
    if (submissionDB.Emails.has(email)) {
      console.log(`Duplicate email detected: ${email}`);
      res.json({ 
        canSubmit: false,
        reason: 'This email has already been used'
      });
      return;
    }

    // Check if IP exists globally
    if (submissionDB.IPs.has(ip)) {
      console.log(`Duplicate IP detected: ${ip}`);
      res.json({ 
        canSubmit: false,
        reason: 'This device has already submitted a form'
      });
      return;
    }

    // Record new submission
    submissionDB.Emails.add(email);
    submissionDB.IPs.add(ip);
    
    if (!submissionDB.Submissions.has(ip)) {
      submissionDB.Submissions.set(ip, new Set());
    }
    submissionDB.Submissions.get(ip)!.add(email);

    console.log(`New submission from IP: ${ip}, Email: ${email}`);
    res.json({ 
      canSubmit: true,
      message: 'Submission accepted' 
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      canSubmit: false,
      reason: 'Internal server error' 
    });
  }
});

// Debug endpoint to view submissions
app.get('/debug', (req: Request, res: Response) => {
  res.json({
    totalIPs: submissionDB.IPs.size,
    totalEmails: submissionDB.Emails.size,
    submissions: Array.from(submissionDB.Submissions.entries()).map(
      ([ip, emails]) => ({ ip, emails: Array.from(emails) })
    )
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
//   console.log('Debug endpoint: http://localhost:3000/debug');
});