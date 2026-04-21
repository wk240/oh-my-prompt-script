import { injectIntoGlobalHook } from "/vendor/react-refresh.js";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;