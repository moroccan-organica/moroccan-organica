# Moroccan Organica - E-Commerce Platform

A premium, bilingual (English/Arabic) e-commerce platform for Moroccan organic products built with Next.js 14+.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with RTL support)
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js (Admin only)
- **UI Components**: Custom components with premium design

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Admin Login
│   ├── (shop)/                # Storefront (Guest-accessible)
│   ├── admin/                 # Admin Dashboard (Protected)
│   ├── api/auth/[...nextauth]/ # NextAuth Handler
│   ├── layout.tsx             # Root layout
│   ├── providers.tsx          # Client-side providers
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── shop/                  # Storefront components
│   └── admin/                 # Admin components
├── lib/
│   ├── prisma.ts              # Singleton DB client
│   └── utils.ts               # Utility functions
├── types/
│   └── next-auth.d.ts         # TypeScript declarations
└── prisma/
    └── schema.prisma          # Database schema
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a MySQL database and update the `.env` file:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/moroccan_organica"
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add the generated secret to `.env`:

```env
NEXTAUTH_SECRET="your-generated-secret"
```

### 4. Run Prisma Migrations

```bash
npx prisma generate
npx prisma db push
```

### 5. Create Admin User (Optional)

You can create an admin user by running:

```bash
npx prisma studio
```

Then manually create a user with:
- Email: `admin@moroccanorganica.com`
- Password: (hashed with bcrypt)
- Role: `ADMIN`

Or use the following script to hash a password:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Bilingual Support (RTL/LTR)

The platform supports both English (LTR) and Arabic (RTL) layouts using Tailwind's logical properties:

- Use `ms-*` instead of `ml-*` (margin-start instead of margin-left)
- Use `me-*` instead of `mr-*` (margin-end instead of margin-right)
- Use `ps-*` instead of `pl-*` (padding-start instead of padding-left)
- Use `pe-*` instead of `pr-*` (padding-end instead of padding-right)
- Use `start-*` instead of `left-*`
- Use `end-*` instead of `right-*`
- Use `border-s-*` instead of `border-l-*`
- Use `border-e-*` instead of `border-r-*`

## 🔐 Authentication

- **Customers**: Guest checkout (no login required)
- **Admins**: Strict login required using email/password
- **Admin Routes**: Protected with NextAuth session middleware

## 📦 Database Models

### Auth Models
- `User` - Admin users
- `Account` - OAuth accounts
- `Session` - User sessions
- `VerificationToken` - Email verification

### E-Commerce Models
- `Category` - Product categories (bilingual)
- `Product` - Products (bilingual)
- `Order` - Customer orders (guest-friendly)
- `OrderItem` - Order line items

## 🎨 Design System

- **Primary Color**: Emerald (`#059669`)
- **Accent Color**: Teal (`#0d9488`)
- **Font**: Inter (Google Fonts)
- **Style**: Modern, premium, gradient-heavy

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

## 🚧 Next Steps

1. **Install Shadcn UI components**:
   ```bash
   npx shadcn@latest init
   ```

2. **Add product images to `/public/products`**

3. **Configure email service** for order notifications

4. **Set up payment gateway** (Stripe, PayPal, etc.)

5. **Add language switcher** component for EN/AR

6. **Implement product search** and filtering

7. **Add shopping cart** functionality

## 📄 License

Proprietary - Moroccan Organica © 2026
# Moroccan Organica
