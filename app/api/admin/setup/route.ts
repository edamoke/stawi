import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

// This endpoint helps create the first admin user
// Should be disabled after initial setup
export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get service role client for admin operations
    const supabase = createAdminClient()

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, email, is_admin")
      .eq("email", email)
      .single()

    if (existingProfile) {
      // If user exists but isn't admin, update them
      if (!existingProfile.is_admin) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ is_admin: true, updated_at: new Date().toISOString() })
          .eq("id", existingProfile.id)

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update admin status", details: updateError.message },
            { status: 500 },
          )
        }

        // Also update user metadata
        await supabase.auth.admin.updateUserById(existingProfile.id, {
          user_metadata: { is_admin: true, full_name: fullName || "Admin" },
        })

        return NextResponse.json({
          success: true,
          message: "User updated to admin successfully",
          userId: existingProfile.id,
        })
      }

      return NextResponse.json({
        success: true,
        message: "User already exists as admin",
        userId: existingProfile.id,
      })
    }

    // Create new user via auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || "Admin",
        is_admin: true,
      },
    })

    if (authError) {
      return NextResponse.json({ error: "Failed to create user", details: authError.message }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "User creation failed" }, { status: 500 })
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Try to verify and force update if needed
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: verifyProfile, error: verifyError } = await supabase
        .from("profiles")
        .select("id, email, is_admin")
        .eq("id", authData.user.id)
        .single()

      if (verifyProfile?.is_admin) {
        // Success - admin status is set
        return NextResponse.json({
          success: true,
          message: "Admin user created successfully",
          userId: authData.user.id,
          email: authData.user.email,
        })
      }

      // Profile not admin yet, force update
      const { error: forceUpdateError } = await supabase
        .from("profiles")
        .update({
          is_admin: true,
          full_name: fullName || "Admin",
          updated_at: new Date().toISOString(),
        })
        .eq("id", authData.user.id)

      if (!forceUpdateError) {
        // Also ensure user metadata is set
        await supabase.auth.admin.updateUserById(authData.user.id, {
          user_metadata: { is_admin: true, full_name: fullName || "Admin" },
        })

        return NextResponse.json({
          success: true,
          message: "Admin user created successfully",
          userId: authData.user.id,
          email: authData.user.email,
        })
      }

      // Wait before retry
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // If all retries failed
    return NextResponse.json({ error: "Unable to verify admin status after signup" }, { status: 500 })
  } catch (error) {
    console.error("[v0] Admin setup error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
