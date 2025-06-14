import { SetMetadata } from '@nestjs/common';
export const Tipos = (...tipos: string[]) => SetMetadata('tipos', tipos);