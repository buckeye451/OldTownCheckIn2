# Old Town Design — Visitor Check-In Kiosk (EmailJS)

A touch-friendly visitor check-in system designed for iPad kiosk deployment. Built with React + Vite and integrated with EmailJS for email notifications.

## Setup

### 1. Create your EmailJS account & template

1. Sign up at [emailjs.com](https://www.emailjs.com) (free tier = 200 emails/month)
2. Go to **Email Services** → connect your email provider (Gmail, Outlook, etc.)
3. Copy your **Service ID** (e.g., `service_abc123`)
4. Go to **Email Templates** → click **Create New Template**
5. Design your email using these template variables:

```
Subject: New Visitor Check-In: {{first_name}} {{last_name}}

Body:
Name: {{first_name}} {{last_name}}
Address: {{address}}
Email: {{email}}
Phone: {{phone}}
Reason for Visit: {{reason}}
Comments: {{comments}}
Check-In Time: {{checkin_time}}
```

6. Copy your **Template ID** (e.g., `template_xyz789`)
7. Go to **Account** → **API Keys** → copy your **Public Key**

### 2. Add your credentials

Open `src/App.jsx` and fill in the CONFIG object at the top:

```js
const CONFIG = {
  companyName: "Old Town Design",
  emailJS: {
    serviceId: "service_abc123",   // ← Your Service ID
    templateId: "template_xyz789", // ← Your Template ID
    publicKey: "your_public_key",  // ← Your Public Key
  },
  ...
};
```

### 3. Deploy to Vercel

Connect this repo to [Vercel](https://vercel.com) and deploy. Vercel auto-detects Vite — no configuration needed.

### 4. iPad Kiosk Setup

1. Open the deployed URL in Safari on your iPad
2. Tap **Share → Add to Home Screen** (launches as full-screen web app)
3. Go to **Settings → Display & Brightness → Auto-Lock → Never**
4. Go to **Settings → Accessibility → Guided Access** → turn on
5. Open the app, triple-click the side button to lock into kiosk mode

## Customization

Edit the `CONFIG` object in `src/App.jsx` to change:
- **Company name**
- **Visit reasons** dropdown options
- **EmailJS credentials**

Edit the `T` (theme) object to change colors, fonts, etc.

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.
