import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would use a secure database
// For now, we'll simulate server-side storage
let aiConfig = {
  provider: "moonshot",
  model: "moonshot-v1-8k",
  // API key would be encrypted and stored securely
  hasApiKey: false,
}

export async function GET() {
  try {
    // Return configuration without the actual API key
    return NextResponse.json({
      provider: aiConfig.provider,
      model: aiConfig.model,
      hasApiKey: aiConfig.hasApiKey,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load configuration" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey, model } = await request.json()

    // Validate input
    if (!provider || !apiKey || !model) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Encrypt the API key
    // 2. Store it in a secure database (Firebase, PostgreSQL, etc.)
    // 3. Associate it with the user's account
    // 4. Validate the API key with the provider

    // For now, we'll simulate saving the configuration
    aiConfig = {
      provider,
      model,
      hasApiKey: true,
      // The actual API key would be encrypted and stored securely
    }

    // TODO: Integrate with Firebase to store configuration
    // await saveToFirebase(userId, { provider, encryptedApiKey, model })

    return NextResponse.json({
      success: true,
      message: "Configuration saved successfully",
    })
  } catch (error) {
    console.error("Failed to save AI configuration:", error)
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 })
  }
}
