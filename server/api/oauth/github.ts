import process from "node:process"
import { SignJWT } from "jose"
import { UserTable } from "#/database/user"

export default defineEventHandler(async (event) => {
  try {
    const db = useDatabase()
    const userTable = db ? new UserTable(db) : undefined
    if (!userTable) throw createError({ statusCode: 500, message: "Database not configured" })
    if (process.env.INIT_TABLE !== "false") await userTable.init()

    const response: {
      access_token?: string
      error?: string
      error_description?: string
    } = await myFetch(
      `https://github.com/login/oauth/access_token`,
      {
        method: "POST",
        body: {
          client_id: process.env.G_CLIENT_ID,
          client_secret: process.env.G_CLIENT_SECRET,
          code: getQuery(event).code,
        },
        headers: {
          accept: "application/json",
        },
      },
    )

    if (!response.access_token) {
      throw createError({
        statusCode: 401,
        message: response.error_description || response.error || "GitHub token exchange failed",
      })
    }

    const userInfo: {
      id: number
      name: string
      avatar_url: string
      email: string
      notification_email: string
    } = await myFetch(`https://api.github.com/user`, {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${response.access_token}`,
        "User-Agent": "NewsNow App",
      },
    })

    const userID = String(userInfo.id)
    await userTable.addUser(userID, userInfo.notification_email || userInfo.email, "github")

    const jwtToken = await new SignJWT({
      id: userID,
      type: "github",
    })
      .setExpirationTime("60d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!))

    const params = new URLSearchParams({
      login: "github",
      jwt: jwtToken,
      user: JSON.stringify({
        avatar: userInfo.avatar_url,
        name: userInfo.name,
      }),
    })
    return sendRedirect(event, `/?${params.toString()}`)
  } catch (e: any) {
    logger.error("GitHub OAuth failed", e)
    if (e.statusCode) throw e
    throw createError({
      statusCode: 500,
      message: e instanceof Error ? e.message : "GitHub OAuth failed",
    })
  }
})
