import '@taujs/server/config';

declare module '@taujs/server/config' {
  interface ServiceContext {
    tenantId?: string;
  }
}
