// src/app/modules/userModules.ts
import { supabase } from '@/lib/supabaseClient';
import { withErrorHandling } from '@/utils/errorHandler';

export async function getAllUsers() {
    const { data: userData, error: userError } = await supabase
        .from('User')
        .select('userId, name, role');

    if (userError) {
        throw new Error(userError.message);
    }

    return userData || [];
}

// getUsersByRole関数をエラーハンドリング付きでラップする
export const getUsersByRole = withErrorHandling(async function getUsersByRole(roles: string[]) {
    const { data: userData, error: userError } = await supabase
        .from('User')
        .select('userId, name, role')
        .in('role', roles);

    if (userError) {
        throw new Error(userError.message);
    }

    return userData || [];
});