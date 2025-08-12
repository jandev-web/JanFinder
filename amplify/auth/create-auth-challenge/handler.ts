import type { CreateAuthChallengeTriggerHandler } from "aws-lambda"

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  const { request, response } = event

  if (
    // session will contain 3 "steps": SRP, password verification, custom challenge
    request.session.length === 2 &&
    request.challengeName === "CUSTOM_CHALLENGE"
  ) {
    response.publicChallengeParameters = { trigger: "true" }
    response.privateChallengeParameters = { answer: "" }
    // optionally set challenge metadata
    response.challengeMetadata = "CAPTCHA_CHALLENGE"
  }

  return event
}