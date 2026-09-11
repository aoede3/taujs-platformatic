import { defineService } from '@taujs/server/config';

export const exampleService = defineService({
  async greet(params: { name: string }) {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 750));

    const modeDescription =
      params.name === 'Streaming'
        ? 'via service descriptors.'
        : 'via direct ctx.call.';

    return {
      message: `Hello, ${params.name}. Response provided by a τjs service ${modeDescription}`,
      timestamp: new Date().toISOString(),
    };
  },

  async getData(params: { id: string }) {
    return {
      id: params.id,
      data: 'Example data from service',
      timestamp: new Date().toISOString(),
    };
  },
});
