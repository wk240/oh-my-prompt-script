import resourceData from "/src/data/resource-library/prompts.json__import.js";
export function getResourcePrompts() {
  return resourceData.prompts;
}
export function getResourceCategories() {
  return resourceData.categories;
}
export function getResourceLibraryData() {
  return resourceData;
}
export function filterPromptsByCategory(categoryId) {
  const prompts = getResourcePrompts();
  if (categoryId === "all") {
    return prompts;
  }
  return prompts.filter((p) => p.categoryId === categoryId || p.sourceCategory === categoryId);
}
export function searchResourcePrompts(query) {
  const prompts = getResourcePrompts();
  const lowerQuery = query.toLowerCase();
  return prompts.filter(
    (p) => p.name.toLowerCase().includes(lowerQuery) || p.content.toLowerCase().includes(lowerQuery)
  );
}
