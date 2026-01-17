import { defineServiceRegistry } from '@taujs/server/config';
import { exampleService } from './example.service.js';

export const serviceRegistry = defineServiceRegistry({
  example: exampleService,
});

export type ServiceRegistry = typeof serviceRegistry;
