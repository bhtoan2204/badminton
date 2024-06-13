import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissionKey';

export const Permission = (permissions: string[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
