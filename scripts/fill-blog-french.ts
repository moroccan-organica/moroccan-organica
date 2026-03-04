
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fillFrenchWithEnglish() {
    console.log('--- Starting Blog French Field Initialization (FR = EN) ---');

    try {
        const { data: posts, error } = await supabase
            .from('BlogPost')
            .select('id, title, titleFr, content, contentFr, excerpt, excerptFr');

        if (error) throw error;
        if (!posts || posts.length === 0) {
            console.log('No posts found.');
            return;
        }

        console.log(`Found ${posts.length} posts to process.`);

        for (const post of posts) {
            const updates: any = {};
            let needsUpdate = false;

            // Fill titleFr if empty
            if (!post.titleFr || post.titleFr.trim() === '') {
                updates.titleFr = post.title;
                needsUpdate = true;
                console.log(`[${post.id}] Copying title -> titleFr`);
            }

            // Fill contentFr if empty
            if (!post.contentFr || post.contentFr.trim() === '') {
                updates.contentFr = post.content;
                needsUpdate = true;
                console.log(`[${post.id}] Copying content -> contentFr`);
            }

            // Fill excerptFr if empty
            if (!post.excerptFr || post.excerptFr.trim() === '') {
                updates.excerptFr = post.excerpt;
                needsUpdate = true;
                console.log(`[${post.id}] Copying excerpt -> excerptFr`);
            }

            if (needsUpdate) {
                const { error: updateError } = await supabase
                    .from('BlogPost')
                    .update(updates)
                    .eq('id', post.id);

                if (updateError) {
                    console.error(`[${post.id}] Update failed:`, updateError.message);
                } else {
                    console.log(`[${post.id}] ✅ Successfully initialized French fields.`);
                }
            } else {
                console.log(`[${post.id}] Skipped (French fields already have data).`);
            }
        }

        console.log('\n--- French Field Initialization Complete ---');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

fillFrenchWithEnglish();
