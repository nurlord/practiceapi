import { SetMetadata } from '@nestjs/common';

export const Auth = () => SetMetadata('isProtected', true);
