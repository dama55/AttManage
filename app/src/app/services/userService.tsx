// src/app/services/userService.ts
import { supabase } from '@/lib/supabaseClient';

export async function getAllUsers() {
    const { data: userData, error: userError } = await supabase
        .from('User')
        .select('userId, name, role');

    if (userError) {
        throw new Error(userError.message);
    }

    return userData || [];
}