import { jsx as _jsx } from "react/jsx-runtime";
import { hydrateApp } from '@taujs/react';
import { App } from './App';
hydrateApp({
    appComponent: _jsx(App, {}),
    rootElementId: 'root',
    enableDebug: import.meta.env.DEV,
});
