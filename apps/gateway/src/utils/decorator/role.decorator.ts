import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'isadmin';
export const Admin = (isadmin: boolean) => SetMetadata(IS_ADMIN_KEY, isadmin);
