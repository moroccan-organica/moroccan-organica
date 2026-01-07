/**
 * Script to create an admin user
 * Run with: npx tsx create-admin.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@moroccanorganica.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Admin User'

    console.log('Creating admin user...\\n')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        console.log(`⚠️  User with email "${email}" already exists!`)
        console.log(`   User ID: ${existingUser.id}`)
        console.log(`   Name: ${existingUser.name}`)
        console.log(`   Role: ${existingUser.role}`)
        return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin user created successfully!\\n')
    console.log('Login Credentials:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Role: ${user.role}`)
    console.log(`\\n⚠️  Please change your password after first login!`)
}

main()
    .catch((e) => {
        console.error('Error creating admin user:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
