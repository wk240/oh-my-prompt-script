import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/ErrorBoundary.tsx.js");import * as RefreshRuntime from "/vendor/react-refresh.js";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
import __vite__cjsImport1_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const Component = __vite__cjsImport1_react["Component"];
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    if (error.message?.includes("Extension context invalidated") || error.message?.includes("Extension context invalidated")) {
      return { hasError: true, error };
    }
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.log("[Oh My Prompt Script] Error caught:", error.message);
    console.log("[Oh My Prompt Script] Component stack:", errorInfo.componentStack);
  }
  render() {
    if (this.state.hasError) {
      console.log("[Oh My Prompt Script] Component error:", this.state.error?.message);
      return null;
    }
    return this.props.children;
  }
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/ErrorBoundary.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/ErrorBoundary.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
