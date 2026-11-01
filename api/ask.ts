import { depsFromEnv, handleAsk } from '../server/ask.js'

export const POST = (request: Request) => handleAsk(request, depsFromEnv())
