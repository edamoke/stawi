import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"

const errorMessages: Record<string, { title: string; description: string }> = {
  access_denied: {
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
  },
  invalid_request: {
    title: "Invalid Request",
    description: "The authentication request was invalid or expired.",
  },
  server_error: {
    title: "Server Error",
    description: "An unexpected error occurred. Please try again later.",
  },
  email_not_confirmed: {
    title: "Email Not Confirmed",
    description: "Please check your email and click the confirmation link.",
  },
  user_not_found: {
    title: "User Not Found",
    description: "No account found with these credentials.",
  },
  invalid_credentials: {
    title: "Invalid Credentials",
    description: "The email or password you entered is incorrect.",
  },
  default: {
    title: "Authentication Error",
    description: "Something went wrong during authentication. Please try again.",
  },
}

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams
  const errorKey = params?.error || "default"
  const errorInfo = errorMessages[errorKey] || errorMessages.default

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-serif text-[#2C2420]">{errorInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-[#6B6560]">{params?.error_description || errorInfo.description}</p>

            {params?.error && (
              <p className="text-xs text-[#A09A94] bg-[#FAF8F5] rounded-lg p-3 font-mono">Error code: {params.error}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild variant="outline" className="flex-1 border-[#E8E4DE] bg-transparent">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild className="flex-1 bg-[#C9A86C] hover:bg-[#B8956B] text-white">
                <Link href="/auth/login" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#A09A94] mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-[#C9A86C] hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
