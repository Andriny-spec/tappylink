// Extensão de tipos para o Profile com campo premium
import { Profile } from '@prisma/client';

declare global {
  namespace PrismaJson {
    interface ProfileExtended extends Profile {
      premium?: boolean;
    }
  }
}

export {};
