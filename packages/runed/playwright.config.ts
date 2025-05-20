import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    webServer: {
        command: 'pnpm dev',
        port: 5173,
        reuseExistingServer: true
    },
    testMatch: /(.+\.)?(spec)\.[jt]s/
};

export default config;
