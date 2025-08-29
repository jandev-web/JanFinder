// src/utils/setFranchiseTemplatesServer.ts
'use server';

import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';


export async function setFranchiseTemplateAction(franchiseID: string, templateType: string, isThere: boolean) {
    const serverDataClient = createServerDataClient(cookies);
    const { data, errors } = await serverDataClient.mutations.setFranchiseTemplate(
        { franchiseID, templateType, isThere },
        { authMode: 'userPool' } // ← must be userPool (not identityPool)
    );

    if (errors?.length) {
        throw new Error(errors[0].message ?? 'setFranchiseTemplate failed');
    }
    return data ?? { message: 'OK' };
}
  