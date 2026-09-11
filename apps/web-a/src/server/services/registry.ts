import { defineServiceRegistry } from '@taujs/server/config';
import { exampleService } from './example.service.ts';

export const serviceRegistry = defineServiceRegistry({
  example: exampleService,
});

export type ServiceRegistry = typeof serviceRegistry;
