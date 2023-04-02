import { Permission } from "./types";

export interface JWTPayload {
    email: string
    userID: number
    employeeID?: number
    clientID?: number
    groupIDs?: number[]
    leadsGroups?: number[]
    supervise?: number[]
    permissions?: any
    roleID: number
    refreshToken_version: number
    iat: number
    exp: number
}