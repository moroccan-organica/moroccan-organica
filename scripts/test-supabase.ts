
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabase() {
    console.log('--- Supabase Project Status ---')
    console.log(`URL: ${supabaseUrl}`)

    const tables = ['User', 'Customer', 'Category', 'Product', 'Order', 'BlogPost']
    let allExist = true

    for (const table of tables) {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error) {
            console.log(`❌ Table "${table}": ${error.message}`)
            allExist = false
        } else {
            console.log(`✅ Table "${table}": OK`)
        }
    }

    if (allExist) {
        console.log('\n✨ All core tables are present and accessible!')
    } else {
        console.log('\n⚠️ Some tables are missing. Migration might be incomplete.')
    }
}

testSupabase()
