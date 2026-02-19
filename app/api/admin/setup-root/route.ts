import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  const email = "edamoke@gmail.com"

  try {
    // 1. Get user ID from auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) throw authError
    
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 2. Update auth user (confirm email and set metadata)
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true,
        app_metadata: { is_admin: true },
        user_metadata: { is_admin: true }
      }
    )
    if (updateAuthError) throw updateAuthError

    // 3. Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("id", user.id)
    if (profileError) throw profileError

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} verified as admin successfully!`,
      userId: user.id
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
