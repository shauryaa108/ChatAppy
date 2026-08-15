import aj from '../lib/arcjet.js'
import { isSpoofedBot } from '@arcjet/inspect'
import ApiError from '../utils/apiError.js'
export const arcjetProtection = async(req,res,next)=>{
    try {
        const decision = await aj.protect(req)
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                
                throw new ApiError(429, "Rate limit exceeded, please try again later");
                
            }
            else if(decision.reason.isBot()){
                    throw new ApiError(403, "Bot access denied");
            }
            else{
                throw new ApiError(403, "Access denied by security policy");
            }
        }
        if(decision.results.some(isSpoofedBot)){
            throw new ApiError(403, "Malicious bot activity detected");
        }
        next()
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error)
        }
        console.error("Arcjet protection error:", error)
        next(new ApiError(500, "Security service unavailable"))
    }
}