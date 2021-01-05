import fetch from "node-fetch"
import jwt from "express-jwt"
import jwksRsa from "jwks-rsa"

export const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://dev-06n9zunr.jp.auth0.com/.well-known/jwks.json"
    }),
    audience: "https://immense-gorge-76747.herokuapp.com/",
    issuer: "https://dev-06n9zunr.jp.auth0.com/",
    algorithms: ["RS256"]
})

export const getUser = async (token: string | undefined) => {
    if (!token) return
    const authRequest = await fetch(
        "https://dev-06n9zunr.jp.auth0.com/userinfo",
        {
            headers: {
                Authorization: token
            }
        }
        )
    return authRequest.json()
}
