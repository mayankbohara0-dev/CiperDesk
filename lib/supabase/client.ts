import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Add type for the global property
declare global {
    interface Window {
        __supabaseClient?: ReturnType<typeof createBrowserClient>;
    }
}

export function createClient() {
    if (typeof window === "undefined") {
        return createBrowserClient(supabaseUrl, supabaseAnonKey, { isSingleton: false });
    }

    if (!window.__supabaseClient) {
        window.__supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, { isSingleton: false });
    }
    return window.__supabaseClient;
}

// Singleton for use in client components
export const supabase = createClient();
