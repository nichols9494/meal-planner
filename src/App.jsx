import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Trash2,
  ShoppingCart,
  Sparkles,
  Utensils,
  Loader2,
  Settings,
  KeyRound,
  MessageCircle,
  Star,
} from "lucide-react";
import { storage } from "./storage";
import { askLLM, saveApiKey, hasApiKey, clearApiKey } from "./llm";

// ---------- static data ----------

const CATEGORY_META = {
  produce: { label: "Produce", emoji: "🥕" },
  protein: { label: "Protein", emoji: "🍗" },
  dairy: { label: "Dairy", emoji: "🧀" },
  grains: { label: "Grains & Bakery", emoji: "🍞" },
  pantry: { label: "Pantry", emoji: "🥫" },
  other: { label: "Other", emoji: "🧂" },
};
const CATEGORY_ORDER = ["produce", "protein", "dairy", "grains", "pantry", "other"];

const MEAL_TYPE_META = {
  breakfast: { label: "Breakfast", color: "var(--sun-mid)" },
  lunch: { label: "Lunch", color: "var(--cyan)" },
  dinner: { label: "Dinner", color: "var(--magenta)" },
  snack: { label: "Snack", color: "var(--violet)" },
};

const EMOJI_CHOICES = ["🍽️", "🍲", "🥗", "🌮", "🍕", "🍳", "🥪", "🍜", "🍔", "🍛", "🐟", "🍚", "🥞", "🥣", "🌯"];

// ---------- date helpers ----------

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function addDays(d, n) {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}
function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isSameDay(a, b) {
  return dateKey(a) === dateKey(b);
}
function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function formatRange(weekStart) {
  const end = addDays(weekStart, 6);
  const startStr = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startStr} – ${endStr}`;
}
function formatMonthLabel(monthAnchor) {
  return monthAnchor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
function formatAmount(n) {
  if (n === null || n === undefined || isNaN(n)) return "";
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(2)));
}
function getMonthGridDates(monthAnchor) {
  const first = startOfMonth(monthAnchor);
  const last = endOfMonth(monthAnchor);
  const gridStart = getMonday(first);
  const totalDays = Math.round((last - gridStart) / 86400000) + 1;
  const weeks = Math.ceil(totalDays / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(gridStart, i));
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---------- shopping list builder ----------

// Converts a recipe amount into the smallest realistic store purchase.
// Matches common ingredients by keyword; measurement units are normalized
// to a base unit (cups for volume, oz for weight) before comparing against
// typical package sizes. Returns a string like "1 half gallon" or null when
// no sensible mapping exists (in which case the recipe amount is shown alone).
const VOLUME_IN_CUPS = { cup: 1, cups: 1, tbsp: 1 / 16, tablespoon: 1 / 16, tablespoons: 1 / 16, tsp: 1 / 48, teaspoon: 1 / 48, teaspoons: 1 / 48, "fl oz": 1 / 8, floz: 1 / 8, pint: 2, pints: 2, quart: 4, quarts: 4, gallon: 16, gallons: 16, ml: 1 / 236.6, l: 4.227, liter: 4.227, liters: 4.227 };
const WEIGHT_IN_OZ = { oz: 1, ounce: 1, ounces: 1, lb: 16, lbs: 16, pound: 16, pounds: 16, g: 0.0353, gram: 0.0353, grams: 0.0353, kg: 35.27 };

const STORE_PACKAGES = [
  { match: ["milk"], kind: "volume", packages: [{ size: 4, label: "quart" }, { size: 8, label: "half gallon" }, { size: 16, label: "gallon" }] },
  { match: ["heavy cream", "whipping cream", "half and half", "half-and-half"], kind: "volume", packages: [{ size: 1, label: "half pint" }, { size: 2, label: "pint" }, { size: 4, label: "quart" }] },
  { match: ["buttermilk"], kind: "volume", packages: [{ size: 4, label: "quart" }] },
  { match: ["broth", "stock"], kind: "volume", packages: [{ size: 4, label: "32oz carton" }, { size: 8, label: "2 cartons (32oz)" }] },
  { match: ["butter"], kind: "volume", packages: [{ size: 0.5, label: "stick" }, { size: 1, label: "half pound (2 sticks)" }, { size: 2, label: "1 lb box" }] },
  { match: ["flour"], kind: "volume", packages: [{ size: 7.5, label: "2 lb bag" }, { size: 18, label: "5 lb bag" }] },
  { match: ["sugar"], kind: "volume", packages: [{ size: 4.5, label: "2 lb bag" }, { size: 9, label: "4 lb bag" }] },
  { match: ["rice"], kind: "volume", packages: [{ size: 2.5, label: "1 lb bag" }, { size: 5, label: "2 lb bag" }, { size: 12.5, label: "5 lb bag" }] },
  { match: ["oats", "oatmeal"], kind: "volume", packages: [{ size: 5, label: "18oz canister" }, { size: 12, label: "42oz canister" }] },
  { match: ["oil"], kind: "volume", packages: [{ size: 2, label: "16oz bottle" }, { size: 6, label: "48oz bottle" }] },
  { match: ["soy sauce", "worcestershire", "vinegar"], kind: "volume", packages: [{ size: 1.25, label: "10oz bottle" }] },
  { match: ["yogurt"], kind: "volume", packages: [{ size: 0.75, label: "6oz cup" }, { size: 4, label: "32oz tub" }] },
  { match: ["sour cream"], kind: "volume", packages: [{ size: 1, label: "8oz tub" }, { size: 2, label: "16oz tub" }] },
  { match: ["cheese"], kind: "volume", packages: [{ size: 2, label: "8oz bag/block" }, { size: 4, label: "16oz bag/block" }] },
  { match: ["egg"], kind: "count", packages: [{ size: 12, label: "dozen" }, { size: 18, label: "18-count" }] },
  { match: ["pasta", "spaghetti", "penne", "macaroni", "fettuccine", "rigatoni", "linguine"], kind: "weight", packages: [{ size: 16, label: "1 lb box" }] },
  { match: ["ground beef", "ground turkey", "ground pork", "ground chicken"], kind: "weight", packages: [{ size: 16, label: "1 lb pack" }, { size: 32, label: "2 lb pack" }] },
  { match: ["chicken breast", "chicken thigh", "chicken thighs"], kind: "weight", packages: [{ size: 16, label: "~1 lb pack" }, { size: 32, label: "~2 lb pack" }] },
  { match: ["bacon"], kind: "count", unitHints: ["slice", "slices"], packages: [{ size: 12, label: "12oz pack (~12 slices)" }] },
  { match: ["bread"], kind: "count", unitHints: ["slice", "slices"], packages: [{ size: 20, label: "loaf" }] },
  { match: ["tortilla", "taco shell"], kind: "count", packages: [{ size: 8, label: "8-count pack" }, { size: 10, label: "10-count pack" }] },
];

function toBaseAmount(amount, unit, kind) {
  const u = (unit || "").toLowerCase().trim();
  if (kind === "volume") {
    if (u in VOLUME_IN_CUPS) return amount * VOLUME_IN_CUPS[u];
    return null;
  }
  if (kind === "weight") {
    if (u in WEIGHT_IN_OZ) return amount * WEIGHT_IN_OZ[u];
    return null;
  }
  if (kind === "count") {
    if (!u || ["", "slice", "slices", "count", "large", "medium", "small"].includes(u)) return amount;
    return null;
  }
  return null;
}

function storePurchaseFor(name, amount, unit) {
  if (amount === null || amount === undefined || isNaN(amount) || amount <= 0) return null;
  const lower = (name || "").toLowerCase();
  for (const entry of STORE_PACKAGES) {
    if (!entry.match.some((kw) => lower.includes(kw))) continue;
    if (entry.unitHints && unit && !entry.unitHints.includes((unit || "").toLowerCase())) continue;
    const base = toBaseAmount(amount, unit, entry.kind);
    if (base === null) continue;
    for (const pkg of entry.packages) {
      if (pkg.size >= base) return `1 ${pkg.label}`;
    }
    const largest = entry.packages[entry.packages.length - 1];
    const count = Math.ceil(base / largest.size);
    return `${count}× ${largest.label}`;
  }
  return null;
}

function buildShoppingList(assignments, includeKeys) {
  const includeSet = new Set(includeKeys);
  const buckets = {};
  Object.entries(assignments).forEach(([dKey, mealsForDay]) => {
    if (!includeSet.has(dKey)) return;
    (mealsForDay || []).forEach((meal) => {
      const scale = meal.baseServings ? (meal.servings || meal.baseServings) / meal.baseServings : 1;
      (meal.ingredients || []).forEach((ing) => {
        const category = CATEGORY_ORDER.includes(ing.category) ? ing.category : "other";
        const unit = (ing.unit || "").trim();
        const name = (ing.name || "").trim();
        if (!name) return;
        const key = name.toLowerCase() + "|" + unit.toLowerCase();
        if (!buckets[category]) buckets[category] = {};
        const amountNum =
          ing.amount === "" || ing.amount === null || ing.amount === undefined || isNaN(Number(ing.amount))
            ? null
            : Number(ing.amount) * scale;
        const priceNum =
          ing.price === "" || ing.price === null || ing.price === undefined || isNaN(Number(ing.price))
            ? null
            : Number(ing.price) * scale;
        if (!buckets[category][key]) {
          buckets[category][key] = {
            name,
            unit,
            amount: amountNum,
            priceSum: priceNum !== null ? priceNum : 0,
            priceCount: priceNum !== null ? 1 : 0,
          };
        } else {
          const existing = buckets[category][key];
          existing.amount = existing.amount !== null && amountNum !== null ? existing.amount + amountNum : null;
          if (priceNum !== null) {
            existing.priceSum += priceNum;
            existing.priceCount += 1;
          }
        }
      });
    });
  });
  return CATEGORY_ORDER.filter((c) => buckets[c]).map((c) => {
    const items = Object.values(buckets[c]).sort((a, b) => a.name.localeCompare(b.name));
    const categoryTotal = items.reduce((s, it) => s + (it.priceCount > 0 ? it.priceSum : 0), 0);
    return { category: c, items, categoryTotal };
  });
}

const BAR_WIDTHS = [2, 4, 1, 3, 2, 5, 1, 2, 4, 3, 1, 2, 5, 2, 1, 3, 4, 2, 1, 3, 2, 4, 1, 3, 2, 5, 1, 2];

function makeInstanceId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function makeCustomMealId() {
  return `custom-${Date.now()}`;
}

function emptyIngredientRow() {
  return { rid: Math.random().toString(36).slice(2, 9), name: "", amount: "", unit: "", price: "", category: "produce" };
}

// ---------- AI meal suggestions ----------

function buildMealSuggestionPrompt(userPrompt, dayLabel) {
  const want = userPrompt && userPrompt.trim() ? userPrompt.trim() : "any tasty, well-rounded meal";
  return `You are a meal-planning assistant. Suggest 4 distinct meal ideas for ${dayLabel}, based on this request: "${want}".

Respond with ONLY a raw JSON array — no markdown, no code fences, no commentary before or after — matching exactly this shape:
[
  {
    "name": "string, meal name",
    "emoji": "a single emoji representing the dish",
    "mealType": "breakfast" | "lunch" | "dinner" | "snack",
    "baseServings": integer, typically 4,
    "ingredients": [
      { "name": "string", "amount": number, "unit": "string such as cup, tbsp, lb, or empty string for whole items", "category": "produce" | "protein" | "dairy" | "grains" | "pantry" | "other", "price": number (estimated total USD cost for this ingredient at the given amount, rough US grocery average) }
    ],
    "instructions": "numbered, step-by-step cooking instructions as plain text with line breaks between steps, e.g. '1. Do this.\\n2. Do that.'"
  }
]

Return exactly 4 meals, each with 4-7 realistic ingredients and clear instructions. Output nothing except the JSON array itself.`;
}

function parseMealSuggestions(raw) {
  let cleaned = (raw || "").trim();
  cleaned = cleaned.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("Unexpected response shape from the model.");
  return parsed.map((m, i) => {
    const mealType = String(m.mealType || "dinner").toLowerCase();
    return {
      id: `ai-${Date.now()}-${i}`,
      name: String(m.name || "Untitled meal").trim(),
      emoji: String(m.emoji || "🍽️").trim() || "🍽️",
      mealType: Object.prototype.hasOwnProperty.call(MEAL_TYPE_META, mealType) ? mealType : "dinner",
      baseServings: Number(m.baseServings) > 0 ? Math.round(Number(m.baseServings)) : 4,
      ingredients: Array.isArray(m.ingredients)
        ? m.ingredients
            .map((ing) => ({
              name: String(ing.name || "").trim(),
              amount: ing.amount === undefined || ing.amount === null || isNaN(Number(ing.amount)) ? null : Number(ing.amount),
              unit: String(ing.unit || "").trim(),
              category: CATEGORY_ORDER.includes(ing.category) ? ing.category : "other",
              price: ing.price === undefined || ing.price === null || isNaN(Number(ing.price)) ? null : Number(ing.price),
            }))
            .filter((ing) => ing.name)
        : [],
      instructions: m.instructions ? String(m.instructions).trim() : null,
    };
  });
}

export default function App() {
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState("week"); // "week" | "month"
  const [assignments, setAssignments] = useState({});
  const [checked, setChecked] = useState(new Set());
  const [customMeals, setCustomMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageWarning, setStorageWarning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [geminiKeySaved, setGeminiKeySaved] = useState(false);
  const [keyEditing, setKeyEditing] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState("");
  const [keyStatusMsg, setKeyStatusMsg] = useState("");
  const [onboardingKeyInput, setOnboardingKeyInput] = useState("");
  const [onboardingStatusMsg, setOnboardingStatusMsg] = useState("");

  const [showAskAI, setShowAskAI] = useState(false);
  const [askMessages, setAskMessages] = useState([]);
  const [askInput, setAskInput] = useState("");
  const [askSending, setAskSending] = useState(false);

  const [activeDayKey, setActiveDayKey] = useState(null);
  const [detailMeal, setDetailMeal] = useState(null); // { dayKey, instanceId } of the meal being viewed
  const [detailInstructionsLoading, setDetailInstructionsLoading] = useState(false);
  const [detailInstructionsError, setDetailInstructionsError] = useState("");
  const [modalTab, setModalTab] = useState("suggested");
  const [showShoppingList, setShowShoppingList] = useState(false);

  const [aiSuggestPrompt, setAiSuggestPrompt] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiSuggestLoading, setAiSuggestLoading] = useState(false);
  const [aiSuggestError, setAiSuggestError] = useState("");

  const [newMealName, setNewMealName] = useState("");
  const [newMealEmoji, setNewMealEmoji] = useState("🍽️");
  const [newMealType, setNewMealType] = useState("dinner");
  const [newMealServings, setNewMealServings] = useState(4);
  const [newMealInstructionsInput, setNewMealInstructionsInput] = useState("");
  const [newMealIngredients, setNewMealIngredients] = useState([emptyIngredientRow()]);

  const today = new Date();

  // load everything once on mount
  useEffect(() => {
    (async () => {
      try {
        const [assignRes, mealsRes] = await Promise.all([
          storage.get("assignments"),
          storage.get("custom-meals"),
        ]);
        setAssignments(assignRes ? JSON.parse(assignRes.value) : {});
        setCustomMeals(mealsRes ? JSON.parse(mealsRes.value) : []);
      } catch {
        setAssignments({});
        setCustomMeals([]);
      }
      setLoading(false);
    })();
    (async () => {
      try {
        const exists = await hasApiKey();
        setGeminiKeySaved(!!exists);
        setKeyEditing(!exists);
        if (!exists) {
          let dismissed = null;
          try {
            dismissed = await storage.get("onboarding-dismissed");
          } catch {
            dismissed = null;
          }
          if (!dismissed) setShowOnboarding(true);
        }
      } catch {
        setGeminiKeySaved(false);
        setKeyEditing(true);
      }
    })();
  }, []);

  const persistAssignments = async (next) => {
    try {
      await storage.set("assignments", JSON.stringify(next));
    } catch {
      setStorageWarning(true);
    }
  };
  const persistCustomMeals = async (list) => {
    try {
      await storage.set("custom-meals", JSON.stringify(list));
    } catch {
      setStorageWarning(true);
    }
  };

  const weekStart = useMemo(() => getMonday(cursorDate), [cursorDate]);
  const monthAnchor = useMemo(() => startOfMonth(cursorDate), [cursorDate]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const monthGridDates = useMemo(() => getMonthGridDates(monthAnchor), [monthAnchor]);

  const rangeDateKeys = useMemo(() => {
    if (viewMode === "week") return days.map(dateKey);
    const first = startOfMonth(cursorDate);
    const last = endOfMonth(cursorDate);
    const keys = [];
    let d = new Date(first);
    while (d <= last) {
      keys.push(dateKey(d));
      d = addDays(d, 1);
    }
    return keys;
  }, [viewMode, days, cursorDate]);

  function goPrev() {
    setCursorDate((d) => (viewMode === "week" ? addDays(d, -7) : addMonths(d, -1)));
  }
  function goNext() {
    setCursorDate((d) => (viewMode === "week" ? addDays(d, 7) : addMonths(d, 1)));
  }
  function goToday() {
    setCursorDate(new Date());
  }

  async function saveKeyFromSettings() {
    const trimmed = keyInputValue.trim();
    if (!trimmed) return;
    try {
      await saveApiKey(trimmed);
      setGeminiKeySaved(true);
      setKeyEditing(false);
      setKeyInputValue("");
      setKeyStatusMsg("Saved");
      setTimeout(() => setKeyStatusMsg(""), 2000);
    } catch (e) {
      setKeyStatusMsg(`⚠️ ${e?.message || e}`);
    }
  }

  async function removeSavedKey() {
    try {
      await clearApiKey();
    } catch {
      // ignore — worst case the file wasn't there to begin with
    }
    setGeminiKeySaved(false);
    setKeyEditing(true);
    setKeyStatusMsg("");
  }

  function addMealToDay(dayKey, meal) {
    const instance = {
      name: meal.name,
      emoji: meal.emoji,
      mealType: meal.mealType,
      ingredients: meal.ingredients,
      baseServings: meal.baseServings || 4,
      servings: meal.baseServings || 4,
      instructions: meal.instructions || null,
      instanceId: makeInstanceId(),
    };
    setAssignments((prev) => {
      const next = { ...prev, [dayKey]: [...(prev[dayKey] || []), instance] };
      persistAssignments(next);
      return next;
    });
    setModalTab("suggested");
  }

  function updateMealServings(dayKey, instanceId, nextServings) {
    const clamped = Math.max(1, Math.min(99, nextServings));
    setAssignments((prev) => {
      const next = {
        ...prev,
        [dayKey]: (prev[dayKey] || []).map((m) => (m.instanceId === instanceId ? { ...m, servings: clamped } : m)),
      };
      persistAssignments(next);
      return next;
    });
  }

  function removeMealFromDay(dayKey, instanceId) {
    setAssignments((prev) => {
      const next = { ...prev, [dayKey]: (prev[dayKey] || []).filter((m) => m.instanceId !== instanceId) };
      persistAssignments(next);
      return next;
    });
  }

  function toggleChecked(itemKey) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  }

  function deleteCustomMeal(id) {
    setCustomMeals((prev) => {
      const next = prev.filter((m) => m.id !== id);
      persistCustomMeals(next);
      return next;
    });
  }

  function resetNewMealForm() {
    setNewMealName("");
    setNewMealEmoji("🍽️");
    setNewMealType("dinner");
    setNewMealServings(4);
    setNewMealInstructionsInput("");
    setNewMealIngredients([emptyIngredientRow()]);
  }

  function updateIngredientRow(rid, field, value) {
    setNewMealIngredients((prev) => prev.map((row) => (row.rid === rid ? { ...row, [field]: value } : row)));
  }
  function removeIngredientRow(rid) {
    setNewMealIngredients((prev) => prev.filter((row) => row.rid !== rid));
  }

  function submitNewMeal() {
    const name = newMealName.trim();
    const ingredients = newMealIngredients
      .filter((row) => row.name.trim())
      .map((row) => ({
        name: row.name.trim(),
        amount: row.amount === "" ? null : Number(row.amount),
        unit: row.unit.trim(),
        price: row.price === "" ? null : Number(row.price),
        category: CATEGORY_ORDER.includes(row.category) ? row.category : "other",
      }));
    if (!name || ingredients.length === 0) return;
    const meal = {
      id: makeCustomMealId(),
      name,
      emoji: newMealEmoji,
      mealType: newMealType,
      baseServings: newMealServings || 4,
      ingredients,
      instructions: newMealInstructionsInput.trim() || null,
    };
    setCustomMeals((prev) => {
      const next = [...prev, meal];
      persistCustomMeals(next);
      return next;
    });
    if (activeDayKey) addMealToDay(activeDayKey, meal);
    resetNewMealForm();
    setModalTab("mine");
  }

  const shoppingList = useMemo(() => buildShoppingList(assignments, rangeDateKeys), [assignments, rangeDateKeys]);
  const totalItems = shoppingList.reduce((sum, cat) => sum + cat.items.length, 0);
  const grandTotal = shoppingList.reduce((sum, cat) => sum + cat.categoryTotal, 0);
  const itemsWithoutPrice = shoppingList.reduce(
    (sum, cat) => sum + cat.items.filter((it) => it.priceCount === 0).length,
    0
  );
  const activeDayMeals = activeDayKey ? assignments[activeDayKey] || [] : [];
  const detailMealData = detailMeal
    ? (assignments[detailMeal.dayKey] || []).find((m) => m.instanceId === detailMeal.instanceId) || null
    : null;
  const detailMealDayLabel = detailMeal
    ? new Date(detailMeal.dayKey + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";
  const activeDayLabel = activeDayKey
    ? new Date(activeDayKey + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  function dismissOnboarding() {
    setShowOnboarding(false);
    storage.set("onboarding-dismissed", "1").catch(() => {});
  }

  async function saveKeyFromOnboarding() {
    const trimmed = onboardingKeyInput.trim();
    if (!trimmed) return;
    try {
      await saveApiKey(trimmed);
      setGeminiKeySaved(true);
      setKeyEditing(false);
      setOnboardingKeyInput("");
      setShowOnboarding(false);
    } catch (e) {
      setOnboardingStatusMsg(`⚠️ ${e?.message || e}`);
    }
  }

  async function sendAskMessage() {
    const text = askInput.trim();
    if (!text || askSending) return;
    setAskMessages((prev) => [...prev, { role: "user", text }]);
    setAskInput("");
    setAskSending(true);
    try {
      const result = await askLLM(text);
      setAskMessages((prev) => [...prev, { role: "assistant", text: result }]);
    } catch (e) {
      setAskMessages((prev) => [...prev, { role: "assistant", text: `⚠️ ${e?.message || e}` }]);
    }
    setAskSending(false);
  }

  async function generateMealSuggestions(promptOverride) {
    const effectivePrompt = promptOverride !== undefined ? promptOverride : aiSuggestPrompt;
    setAiSuggestLoading(true);
    setAiSuggestError("");
    setAiSuggestions([]);
    try {
      const raw = await askLLM(buildMealSuggestionPrompt(effectivePrompt, activeDayLabel || "today"));
      const parsed = parseMealSuggestions(raw);
      setAiSuggestions(parsed);
    } catch (e) {
      setAiSuggestError(`Couldn't generate suggestions: ${e?.message || e}`);
    }
    setAiSuggestLoading(false);
  }

  async function fetchInstructionsForDetail() {
    if (!detailMeal || !detailMealData || detailInstructionsLoading) return;
    setDetailInstructionsLoading(true);
    try {
      const ingList = (detailMealData.ingredients || [])
        .map((ing) => `${ing.amount ?? ""} ${ing.unit || ""} ${ing.name}`.trim())
        .join(", ");
      const raw = await askLLM(
        `Write numbered, step-by-step cooking instructions for "${detailMealData.name}" (serves ${detailMealData.baseServings || 4}) using these ingredients: ${ingList}. Respond with ONLY the numbered steps as plain text, one step per line. No introduction, no commentary.`
      );
      const instructions = (raw || "").trim();
      if (instructions) {
        setAssignments((prev) => {
          const next = {
            ...prev,
            [detailMeal.dayKey]: (prev[detailMeal.dayKey] || []).map((m) =>
              m.instanceId === detailMeal.instanceId ? { ...m, instructions } : m
            ),
          };
          persistAssignments(next);
          return next;
        });
      }
    } catch (e) {
      setDetailInstructionsError(`Couldn't generate instructions: ${e?.message || e}`);
    }
    setDetailInstructionsLoading(false);
  }

  function saveSuggestionToMyMeals(meal) {
    const toSave = {
      id: makeCustomMealId(),
      name: meal.name,
      emoji: meal.emoji,
      mealType: meal.mealType,
      baseServings: meal.baseServings,
      ingredients: meal.ingredients,
      instructions: meal.instructions || null,
    };
    setCustomMeals((prev) => {
      const next = [...prev, toSave];
      persistCustomMeals(next);
      return next;
    });
  }

  return (
    <div className="mp-app mp-body">
      <style>{`
        .mp-app {
          --night: #12081f;
          --night-mid: #241246;
          --panel: rgba(38, 20, 66, 0.55);
          --panel-strong: rgba(34, 18, 60, 0.82);
          --field-bg: rgba(255, 255, 255, 0.07);
          --border-glow: rgba(255, 61, 129, 0.4);
          --magenta: #ff2f78;
          --magenta-soft: #ff6fa8;
          --cyan: #2de2e6;
          --violet: #9b5de5;
          --sun-core: #fff6d6;
          --sun-mid: #ff9d6c;
          --text: #f4eaff;
          --text-dim: rgba(244, 234, 255, 0.62);
          position: relative;
          overflow-x: hidden;
          background: linear-gradient(180deg, #0a0512 0%, #150a26 45%, #0a0512 100%);
          color: var(--text);
          min-height: 100vh;
          padding: 28px 20px 100px;
          box-sizing: border-box;
        }
        .mp-body { font-family: 'Space Grotesk', sans-serif; }
        .mp-display { font-family: 'Orbitron', sans-serif; letter-spacing: 0.02em; }
        .mp-mono { font-family: 'Space Mono', monospace; }

        .mp-content { position: relative; z-index: 1; }

        .mp-header { max-width: 1100px; margin: 0 auto 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
        .mp-title-row { display:flex; align-items:center; gap:10px; }
        .mp-nav { display:flex; align-items:center; gap:10px; flex-wrap: wrap; }
        .mp-nav-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color:var(--text); width:34px; height:34px; border-radius:999px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: all .15s; }
        .mp-nav-btn:hover { background: rgba(45,226,230,0.15); border-color: var(--cyan); box-shadow: 0 0 10px rgba(45,226,230,0.4); }
        .mp-today-btn { background:transparent; border:1px solid var(--magenta-soft); color:var(--text); padding:6px 14px; border-radius:999px; font-size:0.8rem; cursor:pointer; }
        .mp-today-btn:hover { background: rgba(255,47,120,0.15); box-shadow: 0 0 10px rgba(255,47,120,0.4); }

        .view-toggle { display:flex; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); border-radius:999px; padding:3px; gap:2px; }
        .view-toggle-btn { border:none; background:transparent; color:var(--text-dim); padding:6px 16px; border-radius:999px; font-size:0.8rem; cursor:pointer; font-family:'Space Grotesk',sans-serif; }
        .view-toggle-btn.active { background: linear-gradient(90deg, var(--magenta), var(--violet)); color:#fff; box-shadow: 0 0 12px rgba(255,47,120,0.45); }

        .mp-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr; gap:14px; }
        @media (min-width:640px){ .mp-grid{ grid-template-columns:repeat(2,1fr);} }
        @media (min-width:1024px){ .mp-grid{ grid-template-columns:repeat(7,1fr);} }

        .day-card { background: var(--panel-strong); backdrop-filter: blur(8px); border:1px solid var(--border-glow); border-radius:14px; padding:14px; display:flex; flex-direction:column; min-height:230px; box-shadow: 0 0 18px rgba(255,61,129,0.12); }
        .day-card.today { border-color: var(--cyan); box-shadow: 0 0 20px rgba(45,230,230,0.35); }
        .day-card-head { margin-bottom:10px; }
        .day-name { font-size:0.72rem; text-transform:uppercase; letter-spacing:0.1em; opacity:0.6; font-weight:600; }
        .day-date { font-family:'Orbitron', sans-serif; font-size:1.2rem; font-weight:700; }
        .meal-list { display:flex; flex-direction:column; gap:6px; flex:1; }
        .meal-chip { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:7px 8px; display:flex; flex-direction:column; gap:4px; font-size:0.82rem; }
        .meal-chip-top { display:flex; align-items:center; gap:6px; }
        .meal-servings { display:flex; align-items:center; gap:6px; font-size:0.72rem; color:var(--text-dim); padding-left:2px; }
        .servings-btn { background:rgba(255,255,255,0.08); border:none; color:var(--text); width:18px; height:18px; border-radius:4px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:0.85rem; line-height:1; flex-shrink:0; }
        .servings-btn:hover { background:rgba(255,255,255,0.2); }
        .meal-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; box-shadow: 0 0 6px currentColor; }
        .meal-name { flex:1; line-height:1.2; }
        .meal-remove { background:none; border:none; cursor:pointer; opacity:0.45; color:var(--text); display:flex; padding:2px; }
        .meal-remove:hover { opacity:1; color:var(--magenta-soft); }
        .add-meal-btn { margin-top:8px; border:1.5px dashed rgba(255,255,255,0.25); border-radius:8px; padding:8px; background:transparent; color:var(--text-dim); font-size:0.8rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px; }
        .add-meal-btn:hover { background:rgba(45,226,230,0.08); border-color: var(--cyan); color: var(--text); }

        .month-weekday-row { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; max-width:1100px; margin:0 auto 6px; }
        .month-weekday-label { text-align:center; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.08em; opacity:0.55; }
        .month-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; max-width:1100px; margin:0 auto; }
        .month-cell { background: var(--panel); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:8px; min-height:86px; cursor:pointer; display:flex; flex-direction:column; gap:4px; transition: all .15s; }
        .month-cell:hover { border-color: var(--cyan); box-shadow: 0 0 10px rgba(45,226,230,0.25); }
        .month-cell.outside { opacity:0.35; }
        .month-cell.today { border-color: var(--cyan); box-shadow: 0 0 14px rgba(45,230,230,0.3); }
        .month-cell-date { font-family:'Orbitron', sans-serif; font-size:0.85rem; font-weight:700; }
        .month-preview-row { display:flex; flex-wrap:wrap; gap:3px; font-size:0.78rem; }
        .month-more-badge { font-size:0.65rem; opacity:0.6; align-self:center; }

        .mp-overlay { position:fixed; inset:0; background:rgba(8,4,16,0.7); display:flex; align-items:center; justify-content:center; z-index:60; padding:16px; }
        .mp-modal { background:var(--panel-strong); backdrop-filter: blur(14px); border:1px solid var(--border-glow); color:var(--text); border-radius:16px; width:100%; max-width:600px; max-height:85vh; overflow-y:auto; padding:22px; box-shadow: 0 0 40px rgba(255,61,129,0.2); }
        .mp-modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
        .mp-close-btn { background:rgba(255,255,255,0.08); border:none; border-radius:999px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text); }
        .mp-close-btn:hover { background:rgba(255,255,255,0.16); }
        .modal-day-title { font-size:0.85rem; color:var(--text-dim); margin-bottom:12px; }
        .modal-current-meals { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; padding-bottom:16px; border-bottom:1px dashed rgba(255,255,255,0.15); }
        .modal-current-empty { font-size:0.82rem; color:var(--text-dim); margin-bottom:16px; padding-bottom:16px; border-bottom:1px dashed rgba(255,255,255,0.15); }

        .mp-tabs { display:flex; gap:2px; border-bottom:1px solid rgba(255,255,255,0.12); margin-bottom:14px; }
        .mp-tab { padding:8px 14px; font-size:0.85rem; cursor:pointer; border:none; background:none; border-bottom:2px solid transparent; color:var(--text-dim); }
        .mp-tab.active { border-color:var(--magenta); font-weight:600; color:var(--text); }

        .mp-search { display:flex; align-items:center; gap:8px; background:var(--field-bg); border:1px solid rgba(255,255,255,0.14); border-radius:10px; padding:8px 12px; margin-bottom:12px; }
        .mp-search input { border:none; outline:none; flex:1; font-size:0.9rem; background:transparent; color:var(--text); font-family:'Space Grotesk',sans-serif; }

        .suggested-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; }
        .suggested-card { border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px; cursor:pointer; background:rgba(255,255,255,0.05); transition: transform .12s, box-shadow .12s; text-align:left; position:relative; color:var(--text); }
        .suggested-card:hover { transform:translateY(-2px); box-shadow:0 0 14px rgba(45,226,230,0.25); border-color: var(--cyan); }
        .suggested-emoji { font-size:1.6rem; }
        .suggested-name { font-weight:600; font-size:0.9rem; margin-top:4px; }
        .suggested-type { font-size:0.7rem; opacity:0.55; margin-top:2px; text-transform:capitalize; }
        .suggested-del { position:absolute; top:6px; right:6px; background:rgba(255,255,255,0.08); border:none; border-radius:999px; width:22px; height:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text); opacity:0.6; }
        .suggested-del:hover { opacity:1; color:var(--magenta-soft); }
        .mp-empty { text-align:center; padding:30px 10px; opacity:0.6; font-size:0.9rem; }

        .mp-field-label { font-size:0.72rem; text-transform:uppercase; letter-spacing:0.06em; opacity:0.55; margin-bottom:4px; display:block; }
        .mp-input, .mp-select { width:100%; border:1px solid rgba(255,255,255,0.16); border-radius:8px; padding:8px 10px; font-size:0.88rem; background:var(--field-bg); color:var(--text); font-family:'Space Grotesk',sans-serif; box-sizing:border-box; }
        .mp-input::placeholder { color: rgba(244,234,255,0.35); }
        .emoji-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
        .emoji-btn { font-size:1.2rem; width:36px; height:36px; border-radius:8px; border:1.5px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.05); cursor:pointer; }
        .emoji-btn.selected { border-color:var(--magenta); box-shadow: 0 0 8px rgba(255,47,120,0.5); }
        .ing-row { display:grid; grid-template-columns: 1.5fr 0.6fr 0.6fr 0.7fr 0.9fr auto; gap:6px; margin-bottom:8px; align-items:center; }
        @media (max-width:560px){ .ing-row{ grid-template-columns:1fr 1fr; } }
        .ing-remove { background:none; border:none; color:var(--text); opacity:0.5; cursor:pointer; display:flex; }
        .ing-remove:hover { opacity:1; color:var(--magenta-soft); }
        .mp-add-ing { background:none; border:1.5px dashed rgba(255,255,255,0.2); border-radius:8px; padding:8px; width:100%; cursor:pointer; font-size:0.82rem; color:var(--text-dim); display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:16px; }
        .mp-add-ing:hover { border-color: var(--cyan); color: var(--text); }
        .mp-primary-btn { background:linear-gradient(90deg, var(--magenta), var(--violet)); color:#fff; border:none; border-radius:10px; padding:10px 18px; font-size:0.9rem; font-weight:600; cursor:pointer; width:100%; box-shadow: 0 0 16px rgba(255,47,120,0.35); }
        .mp-primary-btn:hover { filter: brightness(1.1); }

        .fab { position:fixed; bottom:22px; right:22px; background:linear-gradient(90deg, var(--magenta), var(--violet)); color:#fff; border:none; border-radius:999px; padding:14px 20px; display:flex; align-items:center; gap:8px; box-shadow:0 0 24px rgba(255,47,120,0.45); cursor:pointer; font-weight:600; font-size:0.9rem; z-index:45; }
        .fab:hover { filter: brightness(1.1); }
        .fab-badge { background:#fff; color:var(--magenta); border-radius:999px; padding:1px 8px; font-size:0.75rem; font-weight:700; }

        .receipt-panel { position:fixed; top:0; right:0; height:100vh; width:100%; max-width:400px; background: linear-gradient(180deg, var(--night-mid), var(--night)); color:var(--text); box-shadow:-10px 0 30px rgba(0,0,0,0.5); z-index:70; display:flex; flex-direction:column; border-left: 1px solid var(--border-glow); }
        .receipt-header { padding:20px 22px 14px; display:flex; align-items:flex-start; justify-content:space-between; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .receipt-disclaimer { font-size:0.72rem; color:var(--text-dim); padding: 10px 22px 0; }
        .receipt-content { flex:1; overflow-y:auto; padding:12px 22px 10px; background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px); }
        .receipt-cat-header { font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:0.08em; font-size:0.7rem; margin-top:16px; margin-bottom:6px; color:var(--cyan); text-shadow: 0 0 8px rgba(45,226,230,0.5); border-bottom:1px dashed rgba(255,255,255,0.18); padding-bottom:4px; display:flex; justify-content:space-between; }
        .receipt-cat-header:first-child { margin-top:0; }
        .receipt-line { display:flex; align-items:baseline; gap:6px; padding:4px 0 0; cursor:pointer; font-family:'Space Mono',monospace; font-size:0.86rem; }
        .receipt-check { width:14px; height:14px; border:1.5px solid var(--text); border-radius:3px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .receipt-check.on { background:var(--magenta); border-color:var(--magenta); color:#fff; }
        .receipt-dots { flex:1; border-bottom:1px dotted rgba(255,255,255,0.3); margin-bottom:4px; min-width:8px; }
        .receipt-line.done .receipt-name, .receipt-line.done .receipt-qty { text-decoration:line-through; opacity:0.4; }
        .receipt-price-line { display:flex; justify-content:flex-end; gap:10px; font-family:'Space Mono',monospace; font-size:0.72rem; color:var(--text-dim); padding-bottom:6px; }
        .receipt-buy-as { margin-right:auto; color:var(--cyan); }
        .meal-name-link { cursor:pointer; }
        .meal-name-link:hover { color:var(--cyan); text-decoration:underline; }
        .detail-section-title { font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:0.08em; font-size:0.7rem; color:var(--cyan); text-shadow: 0 0 8px rgba(45,226,230,0.5); border-bottom:1px dashed rgba(255,255,255,0.18); padding-bottom:4px; margin-bottom:8px; }
        .detail-ing-row { display:flex; align-items:baseline; gap:6px; padding:3px 0; font-family:'Space Mono',monospace; font-size:0.84rem; }
        .detail-ing-name { }
        .detail-ing-qty { color:var(--text-dim); }
        .detail-instructions { font-size:0.88rem; line-height:1.7; white-space:pre-wrap; color:var(--text); }
        .receipt-line-total { color: var(--sun-mid); font-weight:700; }
        .receipt-footer { padding:10px 22px 22px; border-top: 1px solid rgba(255,255,255,0.1); }
        .barcode { display:flex; align-items:flex-end; gap:2px; height:28px; margin-top:6px; }
        .barcode span:nth-child(odd) { background:var(--cyan); flex-shrink:0; height:100%; }
        .barcode span:nth-child(even) { background:var(--magenta-soft); flex-shrink:0; height:100%; }
        .receipt-grand-total { font-family:'Orbitron',sans-serif; font-size:1.1rem; text-align:center; margin-top:12px; color:var(--sun-core); text-shadow: 0 0 10px rgba(255,157,108,0.6); }
        .receipt-grand-note { font-family:'Space Mono',monospace; font-size:0.68rem; text-align:center; margin-top:4px; opacity:0.55; }

        .mp-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:10px; }
        .mp-warning { max-width:1100px; margin:0 auto 16px; background:rgba(255,47,120,0.15); border:1px solid var(--magenta); color:var(--text); padding:10px 14px; border-radius:10px; font-size:0.85rem; }
        .ai-test-row { display:flex; gap:8px; align-items:center; }
        .ai-test-btn { width:auto; flex-shrink:0; padding:10px 20px; }
        .settings-section { padding-top:4px; }
        .settings-section-title { display:flex; align-items:center; gap:6px; font-size:0.85rem; font-weight:600; margin-bottom:8px; color:var(--text); }
        .settings-desc { font-size:0.8rem; color:var(--text-dim); line-height:1.5; margin-bottom:14px; }
        .settings-key-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .settings-key-pill { display:flex; align-items:center; gap:5px; background:rgba(45,226,230,0.12); color:var(--cyan); border:1px solid rgba(45,226,230,0.3); border-radius:999px; padding:4px 10px; font-size:0.78rem; }
        .settings-link-btn { background:none; border:none; color:var(--text-dim); text-decoration:underline; font-size:0.78rem; cursor:pointer; padding:0; }
        .settings-link-btn:hover { color:var(--text); }
        .settings-link-btn.danger:hover { color:var(--magenta-soft); }
        .settings-get-key-link { font-size:0.78rem; color:var(--cyan); text-decoration:none; }
        .settings-get-key-link:hover { text-decoration:underline; }
        .settings-status-msg { margin-top:8px; font-size:0.78rem; color:var(--text-dim); font-family:'Space Mono',monospace; }
        .ask-panel { position:fixed; top:0; right:0; height:100vh; width:100%; max-width:400px; background: linear-gradient(180deg, var(--night-mid), var(--night)); color:var(--text); box-shadow:-10px 0 30px rgba(0,0,0,0.5); z-index:70; display:flex; flex-direction:column; border-left: 1px solid var(--border-glow); }
        .ask-messages { flex:1; overflow-y:auto; padding:16px 20px; display:flex; flex-direction:column; gap:10px; }
        .ask-msg { max-width:85%; padding:10px 12px; border-radius:12px; font-size:0.85rem; line-height:1.5; white-space:pre-wrap; }
        .ask-msg-user { align-self:flex-end; background:linear-gradient(90deg, var(--magenta), var(--violet)); color:#fff; }
        .ask-msg-assistant { align-self:flex-start; background:rgba(255,255,255,0.06); color:var(--text); }
        .ask-msg-loading { opacity:0.6; font-style:italic; }
        .ask-input-row { display:flex; gap:8px; padding:14px 20px; border-top:1px solid rgba(255,255,255,0.1); }
      `}</style>

      <div className="mp-content">
        <div className="mp-header">
          <div className="mp-title-row">
            <Utensils size={26} color="var(--magenta-soft)" />
            <div>
              <div className="mp-display" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
                {viewMode === "week" ? "This Week's Menu" : "This Month's Menu"}
              </div>
              <div className="mp-mono" style={{ fontSize: "0.76rem", opacity: 0.75, marginTop: 6 }}>
                {viewMode === "week" ? formatRange(weekStart) : formatMonthLabel(monthAnchor)}
              </div>
            </div>
          </div>
          <div className="mp-nav">
            <div className="view-toggle">
              <button className={`view-toggle-btn${viewMode === "week" ? " active" : ""}`} onClick={() => setViewMode("week")}>Week</button>
              <button className={`view-toggle-btn${viewMode === "month" ? " active" : ""}`} onClick={() => setViewMode("month")}>Month</button>
            </div>
            <button className="mp-nav-btn" onClick={goPrev} aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="mp-today-btn" onClick={goToday}>Today</button>
            <button className="mp-nav-btn" onClick={goNext} aria-label="Next">
              <ChevronRight size={18} />
            </button>
            <button className="mp-nav-btn" onClick={() => setShowAskAI(true)} aria-label="Ask AI">
              <MessageCircle size={16} />
            </button>
            <button className="mp-nav-btn" onClick={() => setShowSettings(true)} aria-label="Settings">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {storageWarning && (
          <div className="mp-warning">Changes aren't saving right now, so your plan may reset on reload. You can keep going in the meantime.</div>
        )}

        {loading ? (
          <div className="mp-loading">
            <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
            <div className="mp-mono" style={{ fontSize: "0.85rem", opacity: 0.7 }}>Setting the table…</div>
            <style>{`@keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }`}</style>
          </div>
        ) : viewMode === "week" ? (
          <div className="mp-grid">
            {days.map((d) => {
              const key = dateKey(d);
              const meals = assignments[key] || [];
              const isToday = isSameDay(d, today);
              return (
                <div className={`day-card${isToday ? " today" : ""}`} key={key}>
                  <div className="day-card-head">
                    <div className="day-name">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className="day-date">{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  </div>
                  <div className="meal-list">
                    {meals.map((m) => (
                      <div className="meal-chip" key={m.instanceId}>
                        <div className="meal-chip-top">
                          <span className="meal-dot" style={{ background: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color, color: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color }} />
                          <span style={{ fontSize: "1rem" }}>{m.emoji}</span>
                          <span
                            className="meal-name meal-name-link"
                            role="button"
                            tabIndex={0}
                            onClick={() => setDetailMeal({ dayKey: key, instanceId: m.instanceId })}
                            onKeyDown={(e) => { if (e.key === "Enter") setDetailMeal({ dayKey: key, instanceId: m.instanceId }); }}
                          >{m.name}</span>
                          <button className="meal-remove" onClick={() => removeMealFromDay(key, m.instanceId)} aria-label="Remove meal">
                            <X size={14} />
                          </button>
                        </div>
                        <div className="meal-servings">
                          <button className="servings-btn" onClick={() => updateMealServings(key, m.instanceId, (m.servings || m.baseServings || 4) - 1)} aria-label="Fewer servings">−</button>
                          <span>{m.servings || m.baseServings || 4} servings</span>
                          <button className="servings-btn" onClick={() => updateMealServings(key, m.instanceId, (m.servings || m.baseServings || 4) + 1)} aria-label="More servings">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="add-meal-btn"
                    onClick={() => {
                      setActiveDayKey(key);
                      setModalTab("suggested");
                      setAiSuggestPrompt("");
                      setAiSuggestions([]);
                      setAiSuggestError("");
                      generateMealSuggestions("");
                    }}
                  >
                    <Plus size={14} /> Add meal
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="month-weekday-row">
              {WEEKDAY_LABELS.map((w) => (
                <div className="month-weekday-label" key={w}>{w}</div>
              ))}
            </div>
            <div className="month-grid">
              {monthGridDates.map((d) => {
                const key = dateKey(d);
                const meals = assignments[key] || [];
                const isToday = isSameDay(d, today);
                const outside = !isSameMonth(d, monthAnchor);
                const preview = meals.slice(0, 4);
                const extra = meals.length - preview.length;
                return (
                  <div
                    className={`month-cell${outside ? " outside" : ""}${isToday ? " today" : ""}`}
                    key={key}
                    onClick={() => {
                      setActiveDayKey(key);
                      setModalTab("suggested");
                      setAiSuggestPrompt("");
                      setAiSuggestions([]);
                      setAiSuggestError("");
                      generateMealSuggestions("");
                    }}
                  >
                    <div className="month-cell-date">{d.getDate()}</div>
                    <div className="month-preview-row">
                      {preview.map((m) => (
                        <span key={m.instanceId} title={m.name}>{m.emoji}</span>
                      ))}
                      {extra > 0 && <span className="month-more-badge">+{extra}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <button className="fab" onClick={() => setShowShoppingList(true)}>
          <ShoppingCart size={18} />
          Shopping list
          {totalItems > 0 && <span className="fab-badge">{totalItems}</span>}
        </button>
      </div>

      {activeDayKey && (
        <div className="mp-overlay" onClick={() => setActiveDayKey(null)}>
          <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-head">
              <div className="mp-display" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Add a meal</div>
              <button className="mp-close-btn" onClick={() => setActiveDayKey(null)}><X size={16} /></button>
            </div>
            <div className="modal-day-title">{activeDayLabel}</div>

            {activeDayMeals.length > 0 ? (
              <div className="modal-current-meals">
                {activeDayMeals.map((m) => (
                  <div className="meal-chip" key={m.instanceId}>
                    <div className="meal-chip-top">
                      <span className="meal-dot" style={{ background: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color, color: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color }} />
                      <span style={{ fontSize: "1rem" }}>{m.emoji}</span>
                      <span
                        className="meal-name meal-name-link"
                        role="button"
                        tabIndex={0}
                        onClick={() => setDetailMeal({ dayKey: activeDayKey, instanceId: m.instanceId })}
                        onKeyDown={(e) => { if (e.key === "Enter") setDetailMeal({ dayKey: activeDayKey, instanceId: m.instanceId }); }}
                      >{m.name}</span>
                      <button className="meal-remove" onClick={() => removeMealFromDay(activeDayKey, m.instanceId)} aria-label="Remove meal">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="meal-servings">
                      <button className="servings-btn" onClick={() => updateMealServings(activeDayKey, m.instanceId, (m.servings || m.baseServings || 4) - 1)} aria-label="Fewer servings">−</button>
                      <span>{m.servings || m.baseServings || 4} servings</span>
                      <button className="servings-btn" onClick={() => updateMealServings(activeDayKey, m.instanceId, (m.servings || m.baseServings || 4) + 1)} aria-label="More servings">+</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="modal-current-empty">Nothing planned for this day yet.</div>
            )}

            <div className="mp-tabs">
              <button className={`mp-tab${modalTab === "suggested" ? " active" : ""}`} onClick={() => setModalTab("suggested")}>Suggested</button>
              <button className={`mp-tab${modalTab === "mine" ? " active" : ""}`} onClick={() => setModalTab("mine")}>My meals</button>
              <button className={`mp-tab${modalTab === "new" ? " active" : ""}`} onClick={() => setModalTab("new")}>New meal</button>
            </div>

            {modalTab === "suggested" && (
              <>
                <span className="mp-field-label">What are you in the mood for?</span>
                <div className="ai-test-row" style={{ marginBottom: 10 }}>
                  <input
                    className="mp-input"
                    value={aiSuggestPrompt}
                    onChange={(e) => setAiSuggestPrompt(e.target.value)}
                    placeholder="e.g. something quick with chicken, a cozy soup, vegetarian…"
                    onKeyDown={(e) => { if (e.key === "Enter") generateMealSuggestions(); }}
                  />
                  <button className="mp-primary-btn ai-test-btn" onClick={generateMealSuggestions} disabled={aiSuggestLoading}>
                    {aiSuggestLoading ? "Thinking…" : "Suggest"}
                  </button>
                </div>
                <div className="settings-desc" style={{ marginBottom: 12 }}>
                  AI-generated ideas — ingredient amounts and prices are rough estimates and may need adjusting.
                </div>
                {aiSuggestError && <div className="mp-warning" style={{ margin: "0 0 12px" }}>{aiSuggestError}</div>}
                {aiSuggestLoading && (
                  <div className="mp-loading" style={{ minHeight: 100 }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                  </div>
                )}
                {!aiSuggestLoading && aiSuggestions.length > 0 && (
                  <div className="suggested-grid">
                    {aiSuggestions.map((m) => (
                      <div
                        className="suggested-card"
                        role="button"
                        tabIndex={0}
                        key={m.id}
                        onClick={() => addMealToDay(activeDayKey, m)}
                        onKeyDown={(e) => { if (e.key === "Enter") addMealToDay(activeDayKey, m); }}
                      >
                        <button className="suggested-del" onClick={(e) => { e.stopPropagation(); saveSuggestionToMyMeals(m); }} aria-label="Save to My Meals" title="Save to My Meals">
                          <Star size={12} />
                        </button>
                        <div className="suggested-emoji">{m.emoji}</div>
                        <div className="suggested-name">{m.name}</div>
                        <div className="suggested-type">{(MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).label} · Serves {m.baseServings}</div>
                      </div>
                    ))}
                  </div>
                )}
                {!aiSuggestLoading && aiSuggestions.length === 0 && !aiSuggestError && (
                  <div className="mp-empty">Describe what you're craving above and tap "Suggest" for AI meal ideas.</div>
                )}
              </>
            )}

            {modalTab === "mine" && (
              <div className="suggested-grid">
                {customMeals.map((m) => (
                  <div
                    className="suggested-card"
                    role="button"
                    tabIndex={0}
                    key={m.id}
                    onClick={() => addMealToDay(activeDayKey, m)}
                    onKeyDown={(e) => { if (e.key === "Enter") addMealToDay(activeDayKey, m); }}
                  >
                    <button className="suggested-del" onClick={(e) => { e.stopPropagation(); deleteCustomMeal(m.id); }} aria-label="Delete meal">
                      <Trash2 size={12} />
                    </button>
                    <div className="suggested-emoji">{m.emoji}</div>
                    <div className="suggested-name">{m.name}</div>
                    <div className="suggested-type">{(MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).label} · Serves {m.baseServings || 4}</div>
                  </div>
                ))}
                {customMeals.length === 0 && (
                  <div className="mp-empty">You haven't saved any meals yet — create one in the "New meal" tab.</div>
                )}
              </div>
            )}

            {modalTab === "new" && (
              <div>
                <span className="mp-field-label">Meal name</span>
                <input className="mp-input" style={{ marginBottom: 12 }} placeholder="e.g. Grandma's Meatloaf" value={newMealName} onChange={(e) => setNewMealName(e.target.value)} />

                <span className="mp-field-label">Icon</span>
                <div className="emoji-row">
                  {EMOJI_CHOICES.map((em) => (
                    <button key={em} className={`emoji-btn${newMealEmoji === em ? " selected" : ""}`} onClick={() => setNewMealEmoji(em)}>{em}</button>
                  ))}
                </div>

                <span className="mp-field-label">Meal type</span>
                <select className="mp-select" style={{ marginBottom: 14 }} value={newMealType} onChange={(e) => setNewMealType(e.target.value)}>
                  {Object.entries(MEAL_TYPE_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>

                <span className="mp-field-label">Servings this recipe makes</span>
                <input className="mp-input" style={{ marginBottom: 14, maxWidth: 120 }} type="number" min="1" max="99" value={newMealServings} onChange={(e) => setNewMealServings(Number(e.target.value) || 4)} />

                <span className="mp-field-label">Ingredients (name / qty / unit / est. price / category)</span>
                {newMealIngredients.map((row) => (
                  <div className="ing-row" key={row.rid}>
                    <input className="mp-input" placeholder="Ingredient" value={row.name} onChange={(e) => updateIngredientRow(row.rid, "name", e.target.value)} />
                    <input className="mp-input" type="number" min="0" placeholder="Qty" value={row.amount} onChange={(e) => updateIngredientRow(row.rid, "amount", e.target.value)} />
                    <input className="mp-input" placeholder="unit" value={row.unit} onChange={(e) => updateIngredientRow(row.rid, "unit", e.target.value)} />
                    <input className="mp-input" type="number" min="0" step="0.01" placeholder="$" value={row.price} onChange={(e) => updateIngredientRow(row.rid, "price", e.target.value)} />
                    <select className="mp-select" value={row.category} onChange={(e) => updateIngredientRow(row.rid, "category", e.target.value)}>
                      {CATEGORY_ORDER.map((c) => (
                        <option key={c} value={c}>{CATEGORY_META[c].label}</option>
                      ))}
                    </select>
                    <button className="ing-remove" onClick={() => removeIngredientRow(row.rid)} aria-label="Remove ingredient"><X size={16} /></button>
                  </div>
                ))}
                <button className="mp-add-ing" onClick={() => setNewMealIngredients((prev) => [...prev, emptyIngredientRow()])}>
                  <Plus size={14} /> Add ingredient
                </button>

                <span className="mp-field-label">Cooking instructions (optional)</span>
                <textarea
                  className="mp-input"
                  style={{ marginBottom: 14, minHeight: 90, resize: "vertical", fontFamily: "inherit" }}
                  placeholder="1. Preheat oven to 400°F...&#10;2. ..."
                  value={newMealInstructionsInput}
                  onChange={(e) => setNewMealInstructionsInput(e.target.value)}
                />

                <button className="mp-primary-btn" onClick={submitNewMeal}>
                  <Sparkles size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                  Save & add to day
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showShoppingList && (
        <div className="mp-overlay" style={{ background: "rgba(8,4,16,0.55)" }} onClick={() => setShowShoppingList(false)}>
          <div className="receipt-panel" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header">
              <div>
                <div className="mp-display" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Shopping list</div>
                <div className="mp-mono" style={{ fontSize: "0.72rem", opacity: 0.8, marginTop: 4 }}>
                  {viewMode === "week" ? formatRange(weekStart) : formatMonthLabel(monthAnchor)}
                </div>
              </div>
              <button className="mp-close-btn" onClick={() => setShowShoppingList(false)}><X size={16} /></button>
            </div>
            <div className="receipt-disclaimer">Prices are rough estimated U.S. averages — actual cost will vary by store.</div>
            <div className="receipt-content">
              {shoppingList.length === 0 ? (
                <div className="mp-empty">No meals planned yet for this range. Add meals to build a list.</div>
              ) : (
                shoppingList.map((cat) => (
                  <div key={cat.category}>
                    <div className="receipt-cat-header">
                      <span>{CATEGORY_META[cat.category].emoji} {CATEGORY_META[cat.category].label}</span>
                      <span>{cat.categoryTotal > 0 ? `$${cat.categoryTotal.toFixed(2)}` : ""}</span>
                    </div>
                    {cat.items.map((item) => {
                      const itemKey = `${cat.category}|${item.name.toLowerCase()}|${item.unit.toLowerCase()}`;
                      const isChecked = checked.has(itemKey);
                      const avgUnitPrice = item.amount && item.amount > 0 && item.priceCount > 0 ? item.priceSum / item.amount : null;
                      const buyAs = storePurchaseFor(item.name, item.amount, item.unit);
                      return (
                        <div key={itemKey}>
                          <div className={`receipt-line${isChecked ? " done" : ""}`} onClick={() => toggleChecked(itemKey)}>
                            <span className={`receipt-check${isChecked ? " on" : ""}`}>{isChecked && <Check size={10} />}</span>
                            <span className="receipt-name">{item.name}</span>
                            <span className="receipt-dots" />
                            <span className="receipt-qty">{item.amount !== null ? `${formatAmount(item.amount)}${item.unit ? " " + item.unit : ""}` : (item.unit || "—")}</span>
                          </div>
                          <div className="receipt-price-line">
                            {buyAs && <span className="receipt-buy-as">buy: {buyAs}</span>}
                            {avgUnitPrice !== null && <span>avg ${avgUnitPrice.toFixed(2)}/{item.unit || "ea"}</span>}
                            <span className="receipt-line-total">{item.priceCount > 0 ? `$${item.priceSum.toFixed(2)}` : "—"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="receipt-footer">
              <div className="barcode">
                {BAR_WIDTHS.map((w, i) => (
                  <span key={i} style={{ width: w + "px" }} />
                ))}
              </div>
              <div className="receipt-grand-total">Estimated total: ${grandTotal.toFixed(2)}</div>
              <div className="receipt-grand-note">
                {totalItems} item{totalItems === 1 ? "" : "s"}
                {itemsWithoutPrice > 0 ? ` · ${itemsWithoutPrice} without price data (not included above)` : ""}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="mp-overlay" onClick={() => setShowSettings(false)}>
          <div className="mp-modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-head">
              <div className="mp-display" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Settings</div>
              <button className="mp-close-btn" onClick={() => setShowSettings(false)}><X size={16} /></button>
            </div>

            <div className="settings-section">
              <div className="settings-section-title">
                <KeyRound size={15} /> AI assistant
              </div>
              <div className="settings-desc">
                This app tries a local Ollama model first, and falls back to Google Gemini's free API when Ollama
                isn't available (like on a phone). Your key is stored only on this device and never leaves it except
                to talk to Google directly.
              </div>

              {geminiKeySaved && !keyEditing ? (
                <div className="settings-key-row">
                  <span className="settings-key-pill"><Check size={13} /> Gemini key saved</span>
                  <button className="settings-link-btn" onClick={() => setKeyEditing(true)}>Change</button>
                  <button className="settings-link-btn danger" onClick={removeSavedKey}>Remove</button>
                </div>
              ) : (
                <>
                  <div className="ai-test-row" style={{ marginBottom: 8 }}>
                    <input
                      className="mp-input"
                      value={keyInputValue}
                      onChange={(e) => setKeyInputValue(e.target.value)}
                      placeholder="Paste your Gemini API key…"
                    />
                    <button className="mp-primary-btn ai-test-btn" onClick={saveKeyFromSettings}>Save</button>
                  </div>
                  <a className="settings-get-key-link" href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                    Get a free key at aistudio.google.com/apikey →
                  </a>
                </>
              )}
              {keyStatusMsg && <div className="settings-status-msg">{keyStatusMsg}</div>}
            </div>
          </div>
        </div>
      )}

      {detailMeal && detailMealData && (
        <div className="mp-overlay" onClick={() => { setDetailMeal(null); setDetailInstructionsError(""); }}>
          <div className="mp-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.8rem" }}>{detailMealData.emoji}</span>
                <div>
                  <div className="mp-display" style={{ fontSize: "1.2rem", fontWeight: 700 }}>{detailMealData.name}</div>
                  <div className="mp-mono" style={{ fontSize: "0.7rem", opacity: 0.7, marginTop: 2 }}>
                    {detailMealDayLabel} · {(MEAL_TYPE_META[detailMealData.mealType] || MEAL_TYPE_META.dinner).label} · {detailMealData.servings || detailMealData.baseServings || 4} servings
                  </div>
                </div>
              </div>
              <button className="mp-close-btn" onClick={() => { setDetailMeal(null); setDetailInstructionsError(""); }}><X size={16} /></button>
            </div>

            <div className="detail-section-title">Ingredients</div>
            <div className="detail-ingredients">
              {(detailMealData.ingredients || []).map((ing, i) => {
                const scale = detailMealData.baseServings ? (detailMealData.servings || detailMealData.baseServings) / detailMealData.baseServings : 1;
                const scaledAmount = ing.amount !== null && ing.amount !== undefined && !isNaN(Number(ing.amount)) ? Number(ing.amount) * scale : null;
                return (
                  <div className="detail-ing-row" key={i}>
                    <span className="detail-ing-name">{ing.name}</span>
                    <span className="receipt-dots" />
                    <span className="detail-ing-qty">{scaledAmount !== null ? `${formatAmount(scaledAmount)}${ing.unit ? " " + ing.unit : ""}` : (ing.unit || "—")}</span>
                  </div>
                );
              })}
              {(detailMealData.ingredients || []).length === 0 && <div className="mp-empty">No ingredients recorded for this meal.</div>}
            </div>

            <div className="detail-section-title" style={{ marginTop: 16 }}>Instructions</div>
            {detailMealData.instructions ? (
              <div className="detail-instructions">{detailMealData.instructions}</div>
            ) : (
              <div>
                <div className="settings-desc" style={{ marginBottom: 10 }}>
                  This meal doesn't have instructions saved yet.
                </div>
                {detailInstructionsError && <div className="mp-warning" style={{ margin: "0 0 10px" }}>{detailInstructionsError}</div>}
                <button className="mp-primary-btn" onClick={fetchInstructionsForDetail} disabled={detailInstructionsLoading}>
                  {detailInstructionsLoading ? "Generating…" : "✨ Generate instructions with AI"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAskAI && (
        <div className="mp-overlay" style={{ background: "rgba(8,4,16,0.55)" }} onClick={() => setShowAskAI(false)}>
          <div className="ask-panel" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header">
              <div>
                <div className="mp-display" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Ask AI</div>
                <div className="mp-mono" style={{ fontSize: "0.72rem", opacity: 0.8, marginTop: 4 }}>Cooking questions, ideas, substitutions…</div>
              </div>
              <button className="mp-close-btn" onClick={() => setShowAskAI(false)}><X size={16} /></button>
            </div>
            <div className="ask-messages">
              {askMessages.length === 0 && (
                <div className="mp-empty">Ask anything — "what can I sub for buttermilk?", "how long do I roast a whole chicken?", etc.</div>
              )}
              {askMessages.map((m, i) => (
                <div key={i} className={`ask-msg ask-msg-${m.role}`}>{m.text}</div>
              ))}
              {askSending && <div className="ask-msg ask-msg-assistant ask-msg-loading">Thinking…</div>}
            </div>
            <div className="ask-input-row">
              <input
                className="mp-input"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask a question…"
                onKeyDown={(e) => { if (e.key === "Enter") sendAskMessage(); }}
              />
              <button className="mp-primary-btn ai-test-btn" onClick={sendAskMessage} disabled={askSending}>Send</button>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && (
        <div className="mp-overlay" style={{ zIndex: 90 }}>
          <div className="mp-modal" style={{ maxWidth: 440 }}>
            <div className="mp-display" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 10 }}>🍽️ Welcome!</div>
            <div className="settings-desc" style={{ marginBottom: 16 }}>
              This app can suggest meals and answer cooking questions using AI. It tries a local Ollama model first
              (if you have one running), and falls back to Google Gemini's free API otherwise — handy on phones or
              machines without Ollama.
            </div>
            <span className="mp-field-label">Add a free Gemini key to enable this everywhere</span>
            <div className="ai-test-row" style={{ margin: "8px 0" }}>
              <input
                className="mp-input"
                value={onboardingKeyInput}
                onChange={(e) => setOnboardingKeyInput(e.target.value)}
                placeholder="Paste your Gemini API key…"
              />
              <button className="mp-primary-btn ai-test-btn" onClick={saveKeyFromOnboarding}>Save</button>
            </div>
            <a className="settings-get-key-link" href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
              Get a free key at aistudio.google.com/apikey →
            </a>
            {onboardingStatusMsg && <div className="settings-status-msg">{onboardingStatusMsg}</div>}
            <button className="settings-link-btn" style={{ marginTop: 16, display: "block" }} onClick={dismissOnboarding}>
              Skip for now — I'll add this later in Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
