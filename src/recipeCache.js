import { storage } from "./storage";
import { DEFAULT_AI_RECIPES } from "./seedRecipes";

const AI_RECIPE_DB_KEY = "ai-recipe-database-v1";

export const STARTUP_RANDOM_PROMPT = "__startup_random_meals__";
export const DEFAULT_SEED_PROMPT = "__default_seed_recipes__";

function normalizePrompt(prompt) {
  const cleaned = (prompt || "").trim();

  if (!cleaned) {
    return "default";
  }

  return cleaned.toLowerCase().replace(/\s+/g, " ");
}

function normalizeRecipeName(meal) {
  const name =
    meal?.title ||
    meal?.name ||
    meal?.meal ||
    meal?.recipeName ||
    JSON.stringify(meal).slice(0, 100);

  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createEmptyDatabase() {
  return {
    version: 1,
    recipes: {},
    promptIndex: {},
  };
}

export async function loadRecipeDatabase() {
  try {
    const result = await storage.get(AI_RECIPE_DB_KEY);

    if (!result?.value) {
      return createEmptyDatabase();
    }

    const parsed = JSON.parse(result.value);

    if (!parsed || typeof parsed !== "object") {
      return createEmptyDatabase();
    }

    return {
      version: parsed.version || 1,
      recipes: parsed.recipes || {},
      promptIndex: parsed.promptIndex || {},
    };
  } catch {
    return createEmptyDatabase();
  }
}

async function saveRecipeDatabase(database) {
  await storage.set(AI_RECIPE_DB_KEY, JSON.stringify(database));
}

export async function getAllStoredRecipes() {
  const database = await loadRecipeDatabase();

  return Object.values(database.recipes)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((entry) => entry.meal);
}

export async function getRecipesForPrompt(prompt) {
  const database = await loadRecipeDatabase();
  const promptKey = normalizePrompt(prompt);
  const recipeKeys = database.promptIndex[promptKey] || [];

  return recipeKeys
    .map((recipeKey) => database.recipes[recipeKey]?.meal)
    .filter(Boolean);
}

export async function saveGeneratedRecipes(
  prompt,
  meals,
  sourceDayLabel = "today",
) {
  const database = await loadRecipeDatabase();
  const promptKey = normalizePrompt(prompt);
  const now = new Date().toISOString();

  if (!database.promptIndex[promptKey]) {
    database.promptIndex[promptKey] = [];
  }

  for (const meal of meals || []) {
    const recipeNameKey = normalizeRecipeName(meal);

    if (!recipeNameKey) {
      continue;
    }

    const recipeKey = `recipe-${recipeNameKey}`;

    const mealToStore = {
      ...meal,
      id: undefined,
    };

    if (!database.recipes[recipeKey]) {
      database.recipes[recipeKey] = {
        meal: mealToStore,
        createdAt: now,
        updatedAt: now,
        sourceDayLabel,
        prompts: [promptKey],
      };
    } else {
      database.recipes[recipeKey] = {
        ...database.recipes[recipeKey],
        meal: {
          ...database.recipes[recipeKey].meal,
          ...mealToStore,
        },
        updatedAt: now,
        sourceDayLabel,
        prompts: Array.from(
          new Set([...(database.recipes[recipeKey].prompts || []), promptKey]),
        ),
      };
    }

    if (!database.promptIndex[promptKey].includes(recipeKey)) {
      database.promptIndex[promptKey].push(recipeKey);
    }
  }

  await saveRecipeDatabase(database);

  return getRecipesForPrompt(prompt);
}

export async function seedDefaultRecipes() {
  const database = await loadRecipeDatabase();
  const seedPromptKey = normalizePrompt(DEFAULT_SEED_PROMPT);

  const allSeedRecipesAlreadyStored = DEFAULT_AI_RECIPES.every((meal) => {
    const recipeNameKey = normalizeRecipeName(meal);
    return Boolean(database.recipes[`recipe-${recipeNameKey}`]);
  });

  if (
    allSeedRecipesAlreadyStored &&
    Array.isArray(database.promptIndex[seedPromptKey]) &&
    database.promptIndex[seedPromptKey].length >= DEFAULT_AI_RECIPES.length
  ) {
    return getAllStoredRecipes();
  }

  await saveGeneratedRecipes(
    DEFAULT_SEED_PROMPT,
    DEFAULT_AI_RECIPES,
    "built-in starter recipes",
  );

  return getAllStoredRecipes();
}

export function cloneCachedRecipes(meals) {
  return (meals || []).map((meal, index) => ({
    ...meal,
    id: `stored-recipe-${Date.now()}-${index}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
  }));
}
