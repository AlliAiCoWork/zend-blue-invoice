# Zend Blue Invoicing System

A complete, production-ready digital invoice system built with Next.js that integrates with GoHighLevel, QuickBooks, and Fluid Pay.

## ✨ Features

- **Interactive Invoice Display** - Mobile-responsive, clean invoice UI
- **Dynamic Payment Calculations** - Pricing rules automatically applied based on payment method
- **6 Payment Methods** - Debit Card, Credit Card, Premium Card, Zelle, Venmo, PayPal
- **GHL Integration** - Invoice creation, status tracking, SMS/Email delivery
- **QuickBooks Sync** - Automatic invoice and payment synchronization
- **Fluid Pay Gateway** - Secure payment processing with disclosure rates
- **n8n Automation** - Complete workflow automation from invoice to payment
- **Real-time Dashboard** - View all invoices, payments, and status
- **Database-backed** - PostgreSQL with Prisma ORM

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- API keys for: GHL, QuickBooks, Fluid Pay

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Setup database
npx prisma migrate deploy

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 💳 Payment Methods

- **Debit Card**: 1.5% + $0.25
- **Credit Card**: 2.65% + $0.25
- **Premium Card**: 6.5%
- **Zelle**: 0% (no fee)
- **Venmo**: 0% (no fee)
- **PayPal**: Variable rate

## 🚀 Deployment

```bash
vercel deploy --prod
```

See DEPLOYMENT_READY.md for detailed instructions.

## 📋 Documentation

- DEPLOYMENT_READY.md - Complete deployment guide
- INTEGRATIONS.md - Integration setup instructions
- DESIGN_COMPLETE.md - Design specifications

## 🐟 License

Private project for Zend Blue
