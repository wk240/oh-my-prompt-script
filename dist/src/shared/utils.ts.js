export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
export function sortCategoriesByOrder(categories) {
  return [...categories].sort((a, b) => a.order - b.order);
}
export function sortPromptsByOrder(prompts) {
  return [...prompts].sort((a, b) => a.order - b.order);
}
export function sortProviderCategoriesByOrder(categories) {
  return [...categories].sort((a, b) => a.order - b.order);
}
export function stopPropagationHandler(fn) {
  return (e) => {
    e.stopPropagation();
    fn();
  };
}
export const FALLBACK_CATEGORY_ORDER = 99;
export const FALLBACK_PROMPT_ORDER = 99;
