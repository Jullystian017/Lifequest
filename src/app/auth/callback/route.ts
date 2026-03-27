import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createServerClient()
    const { data: { user }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!sessionError && user) {
      // Sync Metadata (Google Profile to Public.Users)
      const metadata = user.user_metadata;
      const googleName = metadata?.full_name || metadata?.name || user.email?.split('@')[0];
      const googleAvatar = metadata?.avatar_url || metadata?.picture;

      // Check if user already exists in public users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, username, class')
        .eq('id', user.id)
        .single();
      
      if (!existingUser) {
        // Create new profile with Google data (relying on DB defaults for stats)
        await supabase.from('users').insert({
          id: user.id,
          username: googleName,
          avatar_url: googleAvatar,
        });
      } else if (existingUser.username === 'Petualang' || !existingUser.username) {
        // Update existing "generic" profile with real Google name
        await supabase.from('users').update({
          username: googleName,
          avatar_url: googleAvatar
        }).eq('id', user.id);
      }

      // Determine final redirect: Onboarding if no class is set
      const isNewUser = !existingUser || !existingUser.class;
      const finalNext = isNewUser ? '/dashboard/onboarding' : next;

      return NextResponse.redirect(`${origin}${finalNext}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
