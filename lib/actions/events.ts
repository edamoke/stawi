"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const eventData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    long_description: formData.get("long_description") as string,
    image_url: formData.get("image_url") as string,
    event_date: formData.get("event_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    location: formData.get("location") as string,
    venue: formData.get("venue") as string,
    max_attendees: formData.get("max_attendees") ? Number.parseInt(formData.get("max_attendees") as string) : null,
    price: formData.get("price") ? Number.parseFloat(formData.get("price") as string) : 0,
    is_free: formData.get("is_free") === "true",
    is_published: formData.get("is_published") === "true",
    is_featured: formData.get("is_featured") === "true",
    category: formData.get("category") as string,
    tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [],
  }

  const { data, error } = await supabase.from("events").insert(eventData).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/events")
  revalidatePath("/events")
  return { success: true, data }
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const eventData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    long_description: formData.get("long_description") as string,
    image_url: formData.get("image_url") as string,
    event_date: formData.get("event_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    location: formData.get("location") as string,
    venue: formData.get("venue") as string,
    max_attendees: formData.get("max_attendees") ? Number.parseInt(formData.get("max_attendees") as string) : null,
    price: formData.get("price") ? Number.parseFloat(formData.get("price") as string) : 0,
    is_free: formData.get("is_free") === "true",
    is_published: formData.get("is_published") === "true",
    is_featured: formData.get("is_featured") === "true",
    category: formData.get("category") as string,
    tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [],
  }

  const { data, error } = await supabase.from("events").update(eventData).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/events")
  revalidatePath(`/admin/events/${id}`)
  revalidatePath("/events")
  revalidatePath(`/events/${eventData.slug}`)
  return { success: true, data }
}

export async function deleteEvent(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/events")
  revalidatePath("/events")
  return { success: true }
}

export async function getEventRegistrations(eventId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("event_registrations")
    .select(`
      *,
      profiles (id, email, full_name)
    `)
    .eq("event_id", eventId)
    .order("registered_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function updateRegistrationStatus(registrationId: string, status: string, paymentStatus?: string) {
  await requireAdmin()
  const supabase = await createClient()

  const updateData: any = { status }
  if (paymentStatus) {
    updateData.payment_status = paymentStatus
  }

  const { error } = await supabase.from("event_registrations").update(updateData).eq("id", registrationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/events")
  return { success: true }
}

export async function registerForEvent(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to register for events" }
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()
  if (!profile) {
    return { error: "Profile not found" }
  }

  // Get event details
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, price, max_attendees")
    .eq("id", eventId)
    .single()

  if (eventError || !event) {
    return { error: "Event not found" }
  }

  // Check if already registered
  const { data: existing } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", profile.id)
    .single()

  if (existing) {
    return { error: "You are already registered for this event" }
  }

  // Check max attendees
  if (event.max_attendees) {
    const { count } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "registered")

    if (count && count >= event.max_attendees) {
      return { error: "This event is full" }
    }
  }

  // Create registration
  const { data, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      user_id: profile.id,
      status: event.price > 0 ? "pending_payment" : "registered",
      payment_status: event.price > 0 ? "pending" : "completed",
      payment_amount: event.price,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/events")
  revalidatePath(`/events/${eventId}`)
  revalidatePath("/account/events")
  return { success: true, data }
}

export async function cancelRegistration(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in" }
  }

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()
  if (!profile) {
    return { error: "Profile not found" }
  }

  const { error } = await supabase
    .from("event_registrations")
    .update({ status: "cancelled" })
    .eq("event_id", eventId)
    .eq("user_id", profile.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/events")
  revalidatePath(`/events/${eventId}`)
  revalidatePath("/account/events")
  return { success: true }
}

export async function getUserRegistrations() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in" }
  }

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()
  if (!profile) {
    return { error: "Profile not found" }
  }

  const { data, error } = await supabase
    .from("event_registrations")
    .select(`
      *,
      events (*)
    `)
    .eq("user_id", profile.id)
    .order("registered_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function checkRegistrationStatus(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { isRegistered: false }
  }

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()
  if (!profile) {
    return { isRegistered: false }
  }

  const { data } = await supabase
    .from("event_registrations")
    .select("id, status")
    .eq("event_id", eventId)
    .eq("user_id", profile.id)
    .single()

  return {
    isRegistered: !!data,
    status: data?.status,
    registrationId: data?.id,
  }
}
