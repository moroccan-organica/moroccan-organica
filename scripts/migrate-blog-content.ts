import { createClient } from '@supabase/supabase-js';
import { generateHTML } from '@tiptap/html/server';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const extensions = [
    StarterKit,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            rel: 'noopener noreferrer nofollow',
            target: '_blank',
        },
    }),
    Image.configure({
        HTMLAttributes: {
            class: 'editor-image',
        },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Youtube.configure({ controls: false, nocookie: true }),
];

async function migrateBlogPosts() {
    console.log('--- Starting Blog Content Migration (JSON to HTML) ---');

    try {
        const { data: posts, error } = await supabase
            .from('BlogPost')
            .select('id, title, content, contentAr, excerpt, excerptAr');

        if (error) throw error;
        if (!posts || posts.length === 0) {
            console.log('No posts found.');
            return;
        }

        console.log(`Found ${posts.length} posts to check.`);

        for (const post of posts) {
            const updates: any = {};
            let needsUpdate = false;

            // Check main content
            if (post.content && post.content.trim().startsWith('{')) {
                try {
                    const json = JSON.parse(post.content);
                    const html = generateHTML(json, extensions);
                    updates.content = html;
                    needsUpdate = true;
                    console.log(`[${post.id}] Migrating 'content' for: ${post.title}`);
                } catch (e) {
                    console.error(`[${post.id}] Error parsing content JSON:`, e);
                }
            }

            // Check Arabic content
            if (post.contentAr && post.contentAr.trim().startsWith('{')) {
                try {
                    const json = JSON.parse(post.contentAr);
                    const html = generateHTML(json, extensions);
                    updates.contentAr = html;
                    needsUpdate = true;
                    console.log(`[${post.id}] Migrating 'contentAr' for: ${post.title}`);
                } catch (e) {
                    console.error(`[${post.id}] Error parsing contentAr JSON:`, e);
                }
            }

            // Check excerpt
            if (post.excerpt && post.excerpt.trim().startsWith('{')) {
                try {
                    const json = JSON.parse(post.excerpt);
                    const html = generateHTML(json, extensions);
                    // For excerpts, we want plain text manually stripped of tags
                    const plainText = html.replace(/<[^>]*>/g, ' ');
                    updates.excerpt = plainText.trim();
                    needsUpdate = true;
                    console.log(`[${post.id}] Migrating 'excerpt' (as plain text) for: ${post.title}`);
                } catch (e) {
                    console.error(`[${post.id}] Error parsing excerpt JSON:`, e);
                }
            }

            // Check Arabic excerpt
            if (post.excerptAr && post.excerptAr.trim().startsWith('{')) {
                try {
                    const json = JSON.parse(post.excerptAr);
                    const html = generateHTML(json, extensions);
                    const plainText = html.replace(/<[^>]*>/g, ' ');
                    updates.excerptAr = plainText.trim();
                    needsUpdate = true;
                    console.log(`[${post.id}] Migrating 'excerptAr' (as plain text) for: ${post.title}`);
                } catch (e) {
                    console.error(`[${post.id}] Error parsing excerptAr JSON:`, e);
                }
            }

            if (needsUpdate) {
                const { error: updateError } = await supabase
                    .from('BlogPost')
                    .update(updates)
                    .eq('id', post.id);

                if (updateError) {
                    console.error(`[${post.id}] Update failed:`, updateError.message);
                } else {
                    console.log(`[${post.id}] ✅ Successfully updated.`);
                }
            } else {
                console.log(`[${post.id}] Skipped (already HTML).`);
            }
        }

        console.log('\n--- Migration Complete ---');
    }
    catch (err) {
        console.error('Migration failed:', err);
    }
}

migrateBlogPosts();
