import { create } from "/vendor/.vite-deps-zustand.js__v--5162552b.js";
import { MessageType } from "/src/shared/messages.ts.js";
import { sortPromptsByOrder } from "/src/shared/utils.ts.js";
import { triggerSync } from "/src/lib/sync/sync-manager.ts.js";
async function sendStorageMessage(type, payload) {
  try {
    const response = await chrome.runtime.sendMessage({
      type,
      payload
    });
    if (!response?.success) {
      throw new Error(response?.error || "Storage operation failed");
    }
    return response.data;
  } catch (error) {
    console.error("[Oh My Prompt Script] Storage message error:", error);
    throw error;
  }
}
function generateId() {
  return crypto.randomUUID();
}
function getDefaultState() {
  return {
    prompts: [],
    categories: [],
    selectedCategoryId: "all"
  };
}
function migratePromptOrders(prompts) {
  const needsMigration = prompts.some((p) => p.order === void 0 || p.order === null);
  if (!needsMigration) return prompts;
  const categoryMap = /* @__PURE__ */ new Map();
  prompts.forEach((p) => {
    const list = categoryMap.get(p.categoryId) || [];
    list.push(p);
    categoryMap.set(p.categoryId, list);
  });
  const migrated = [];
  categoryMap.forEach((categoryPrompts) => {
    categoryPrompts.forEach((p, index) => {
      migrated.push({
        ...p,
        order: p.order ?? index
      });
    });
  });
  console.log("[Oh My Prompt Script] Migrated prompt order field for", migrated.length, "prompts");
  return migrated;
}
export const usePromptStore = create((set, get) => ({
  // Initial state
  prompts: [],
  categories: [],
  selectedCategoryId: "all",
  isLoading: true,
  // Actions
  loadFromStorage: async () => {
    set({ isLoading: true });
    try {
      const data = await sendStorageMessage(MessageType.GET_STORAGE);
      if (data && data.userData) {
        if (data.userData.prompts.length > 500) {
          console.warn("[Oh My Prompt Script] Large dataset loaded:", data.userData.prompts.length, "prompts");
        }
        const migratedPrompts = migratePromptOrders(data.userData.prompts);
        set({
          prompts: migratedPrompts,
          categories: data.userData.categories,
          selectedCategoryId: "all",
          isLoading: false
        });
        if (migratedPrompts !== data.userData.prompts) {
          get().saveToStorage();
        }
        return { success: true };
      } else {
        const defaultState = getDefaultState();
        set({
          prompts: defaultState.prompts,
          categories: defaultState.categories,
          selectedCategoryId: "all",
          isLoading: false
        });
        return { success: true };
      }
    } catch (error) {
      console.error("[Oh My Prompt Script] Failed to load storage:", error);
      const defaultState = getDefaultState();
      set({
        prompts: defaultState.prompts,
        categories: defaultState.categories,
        selectedCategoryId: "all",
        isLoading: false
      });
      return { success: false, error: "数据加载失败，请检查存储权限" };
    }
  },
  saveToStorage: async () => {
    const { prompts, categories } = get();
    try {
      const version = chrome.runtime.getManifest().version;
      await sendStorageMessage(MessageType.SET_STORAGE, {
        version,
        userData: { prompts, categories },
        settings: { showBuiltin: true, syncEnabled: false }
      });
      triggerSync({ prompts, categories }).catch((err) => {
        console.warn("[Oh My Prompt Script] Sync trigger failed:", err);
      });
      return { success: true };
    } catch (error) {
      console.error("[Oh My Prompt Script] Failed to save storage:", error);
      return { success: false, error: "数据保存失败，请检查存储配额" };
    }
  },
  setSelectedCategory: (categoryId) => {
    set({ selectedCategoryId: categoryId });
  },
  // Prompt CRUD
  addPrompt: (prompt) => {
    const { prompts } = get();
    const categoryPrompts = prompts.filter((p) => p.categoryId === prompt.categoryId);
    const maxOrder = categoryPrompts.length > 0 ? Math.max(...categoryPrompts.map((p) => p.order)) : -1;
    const newPrompt = {
      ...prompt,
      id: generateId(),
      order: maxOrder + 1
    };
    set((state) => ({
      prompts: [...state.prompts, newPrompt]
    }));
    get().saveToStorage();
  },
  updatePrompt: (id, updates) => {
    set((state) => ({
      prompts: state.prompts.map(
        (prompt) => prompt.id === id ? { ...prompt, ...updates } : prompt
      )
    }));
    get().saveToStorage();
  },
  deletePrompt: (id) => {
    set((state) => ({
      prompts: state.prompts.filter((prompt) => prompt.id !== id)
    }));
    get().saveToStorage();
  },
  // Category CRUD
  addCategory: (name) => {
    const { categories } = get();
    const newCategory = {
      id: generateId(),
      name,
      order: categories.length
    };
    set((state) => ({
      categories: [...state.categories, newCategory]
    }));
    get().saveToStorage();
  },
  deleteCategory: (id) => {
    set((state) => {
      const updatedCategories = state.categories.filter((cat) => cat.id !== id);
      const updatedPrompts = state.prompts.filter((prompt) => prompt.categoryId !== id);
      return {
        categories: updatedCategories,
        prompts: updatedPrompts,
        // If deleted category was selected, switch to 'all'
        selectedCategoryId: state.selectedCategoryId === id ? "all" : state.selectedCategoryId
      };
    });
    get().saveToStorage();
  },
  // Reorder categories
  reorderCategories: (newOrder) => {
    set((state) => {
      const updatedCategories = state.categories.map((cat) => ({
        ...cat,
        order: newOrder.indexOf(cat.id)
      }));
      return { categories: updatedCategories };
    });
    get().saveToStorage();
  },
  // Reorder prompts within a category
  reorderPrompts: (categoryId, newOrder) => {
    set((state) => {
      const updatedPrompts = state.prompts.map((prompt) => {
        if (prompt.categoryId === categoryId) {
          return {
            ...prompt,
            order: newOrder.indexOf(prompt.id)
          };
        }
        return prompt;
      });
      return { prompts: updatedPrompts };
    });
    get().saveToStorage();
  },
  // Reorder all prompts globally
  reorderAllPrompts: (newOrder) => {
    set((state) => {
      const updatedPrompts = state.prompts.map((prompt) => {
        const newIndex = newOrder.indexOf(prompt.id);
        if (newIndex !== -1) {
          return {
            ...prompt,
            order: newIndex
          };
        }
        return prompt;
      });
      return { prompts: updatedPrompts };
    });
    get().saveToStorage();
  },
  // Computed getters
  getPromptsByCategory: (categoryId) => {
    const { prompts } = get();
    const categoryPrompts = prompts.filter((prompt) => prompt.categoryId === categoryId);
    return sortPromptsByOrder(categoryPrompts);
  },
  getFilteredPrompts: () => {
    const { prompts, selectedCategoryId } = get();
    if (selectedCategoryId === "all" || selectedCategoryId === null) {
      return prompts;
    }
    const categoryPrompts = prompts.filter((prompt) => prompt.categoryId === selectedCategoryId);
    return sortPromptsByOrder(categoryPrompts);
  }
}));
