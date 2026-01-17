import type { RegistryCaller } from '@taujs/server/config';
import type { serviceRegistry } from './registry';

declare module '@taujs/server/config' {
  interface ServiceContext {
    call: RegistryCaller<typeof serviceRegistry>;
  }
}
