'use server'

import { signOut } from "@/auth"
import { CONFIG } from "@/app/config"

export async function logout() {
    await signOut({ redirectTo: CONFIG.ROUTE.HOME });
}