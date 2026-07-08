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
} from "lucide-react";
import { storage } from "./storage";
import { askLLM } from "./llm";

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

// price fields below are rough estimated U.S. grocery averages for the
// listed quantity — meant as a ballpark for the shopping list, not a quote.
const MEAL_LIBRARY = [
  { id: "sm-pancakes", name: "Pancakes", emoji: "🥞", mealType: "breakfast", ingredients: [
    { name: "Flour", amount: 2, unit: "cup", category: "grains", price: 0.20 },
    { name: "Milk", amount: 1.5, unit: "cup", category: "dairy", price: 0.40 },
    { name: "Eggs", amount: 2, unit: "", category: "protein", price: 0.70 },
    { name: "Butter", amount: 3, unit: "tbsp", category: "dairy", price: 0.45 },
    { name: "Baking powder", amount: 1, unit: "tbsp", category: "pantry", price: 0.15 },
    { name: "Maple syrup", amount: 0.5, unit: "cup", category: "pantry", price: 1.75 },
  ]},
  { id: "sm-omelette", name: "Veggie Omelette", emoji: "🍳", mealType: "breakfast", ingredients: [
    { name: "Eggs", amount: 3, unit: "", category: "protein", price: 1.05 },
    { name: "Bell pepper", amount: 1, unit: "", category: "produce", price: 1.00 },
    { name: "Spinach", amount: 1, unit: "cup", category: "produce", price: 0.60 },
    { name: "Onion", amount: 0.5, unit: "", category: "produce", price: 0.30 },
    { name: "Cheddar cheese", amount: 0.5, unit: "cup", category: "dairy", price: 0.50 },
  ]},
  { id: "sm-oats", name: "Overnight Oats", emoji: "🥣", mealType: "breakfast", ingredients: [
    { name: "Rolled oats", amount: 1, unit: "cup", category: "grains", price: 0.35 },
    { name: "Milk", amount: 1, unit: "cup", category: "dairy", price: 0.25 },
    { name: "Chia seeds", amount: 1, unit: "tbsp", category: "pantry", price: 0.60 },
    { name: "Honey", amount: 1, unit: "tbsp", category: "pantry", price: 0.45 },
    { name: "Blueberries", amount: 0.5, unit: "cup", category: "produce", price: 1.50 },
  ]},
  { id: "sm-avotoast", name: "Avocado Toast", emoji: "🥑", mealType: "breakfast", ingredients: [
    { name: "Bread", amount: 2, unit: "slices", category: "grains", price: 0.70 },
    { name: "Avocado", amount: 1, unit: "", category: "produce", price: 1.25 },
    { name: "Lemon", amount: 0.5, unit: "", category: "produce", price: 0.30 },
    { name: "Eggs", amount: 2, unit: "", category: "protein", price: 0.70 },
    { name: "Red pepper flakes", amount: 1, unit: "tsp", category: "other", price: 0.10 },
  ]},
  { id: "sm-caesar", name: "Caesar Salad", emoji: "🥗", mealType: "lunch", ingredients: [
    { name: "Romaine lettuce", amount: 1, unit: "head", category: "produce", price: 2.00 },
    { name: "Parmesan cheese", amount: 0.5, unit: "cup", category: "dairy", price: 0.75 },
    { name: "Croutons", amount: 1, unit: "cup", category: "grains", price: 1.20 },
    { name: "Caesar dressing", amount: 0.5, unit: "cup", category: "pantry", price: 1.00 },
    { name: "Chicken breast", amount: 1, unit: "", category: "protein", price: 2.00 },
  ]},
  { id: "sm-club", name: "Turkey Club Sandwich", emoji: "🥪", mealType: "lunch", ingredients: [
    { name: "Bread", amount: 3, unit: "slices", category: "grains", price: 1.05 },
    { name: "Turkey breast", amount: 4, unit: "oz", category: "protein", price: 1.50 },
    { name: "Bacon", amount: 2, unit: "slices", category: "protein", price: 1.00 },
    { name: "Lettuce", amount: 2, unit: "leaves", category: "produce", price: 0.30 },
    { name: "Tomato", amount: 1, unit: "", category: "produce", price: 0.70 },
    { name: "Mayonnaise", amount: 2, unit: "tbsp", category: "pantry", price: 0.40 },
  ]},
  { id: "sm-greek", name: "Greek Salad", emoji: "🥗", mealType: "lunch", ingredients: [
    { name: "Cucumber", amount: 1, unit: "", category: "produce", price: 0.90 },
    { name: "Tomato", amount: 2, unit: "", category: "produce", price: 1.40 },
    { name: "Red onion", amount: 0.5, unit: "", category: "produce", price: 0.30 },
    { name: "Feta cheese", amount: 0.5, unit: "cup", category: "dairy", price: 1.00 },
    { name: "Kalamata olives", amount: 0.25, unit: "cup", category: "pantry", price: 0.65 },
    { name: "Olive oil", amount: 2, unit: "tbsp", category: "pantry", price: 0.70 },
  ]},
  { id: "sm-burritobowl", name: "Chicken Burrito Bowl", emoji: "🌯", mealType: "lunch", ingredients: [
    { name: "Chicken breast", amount: 1, unit: "lb", category: "protein", price: 4.00 },
    { name: "Rice", amount: 1, unit: "cup", category: "grains", price: 0.30 },
    { name: "Black beans", amount: 1, unit: "can", category: "pantry", price: 1.20 },
    { name: "Corn", amount: 0.5, unit: "cup", category: "produce", price: 0.40 },
    { name: "Salsa", amount: 0.5, unit: "cup", category: "pantry", price: 1.50 },
    { name: "Avocado", amount: 1, unit: "", category: "produce", price: 1.25 },
  ]},
  { id: "sm-bolognese", name: "Spaghetti Bolognese", emoji: "🍝", mealType: "dinner", ingredients: [
    { name: "Ground beef", amount: 1, unit: "lb", category: "protein", price: 6.00 },
    { name: "Spaghetti", amount: 1, unit: "box", category: "grains", price: 1.80 },
    { name: "Canned tomatoes", amount: 2, unit: "can", category: "pantry", price: 3.00 },
    { name: "Onion", amount: 1, unit: "", category: "produce", price: 0.60 },
    { name: "Garlic", amount: 3, unit: "cloves", category: "produce", price: 0.60 },
    { name: "Parmesan cheese", amount: 0.5, unit: "cup", category: "dairy", price: 0.75 },
  ]},
  { id: "sm-stirfry", name: "Chicken Stir Fry", emoji: "🥡", mealType: "dinner", ingredients: [
    { name: "Chicken breast", amount: 1, unit: "lb", category: "protein", price: 4.00 },
    { name: "Broccoli", amount: 2, unit: "cup", category: "produce", price: 2.40 },
    { name: "Bell pepper", amount: 1, unit: "", category: "produce", price: 1.00 },
    { name: "Soy sauce", amount: 3, unit: "tbsp", category: "pantry", price: 0.45 },
    { name: "Garlic", amount: 2, unit: "cloves", category: "produce", price: 0.40 },
    { name: "Rice", amount: 1, unit: "cup", category: "grains", price: 0.30 },
  ]},
  { id: "sm-tacos", name: "Tacos", emoji: "🌮", mealType: "dinner", ingredients: [
    { name: "Ground beef", amount: 1, unit: "lb", category: "protein", price: 6.00 },
    { name: "Taco shells", amount: 8, unit: "", category: "grains", price: 2.40 },
    { name: "Cheddar cheese", amount: 1, unit: "cup", category: "dairy", price: 1.00 },
    { name: "Lettuce", amount: 1, unit: "cup", category: "produce", price: 1.00 },
    { name: "Tomato", amount: 1, unit: "", category: "produce", price: 0.70 },
    { name: "Sour cream", amount: 0.5, unit: "cup", category: "dairy", price: 0.80 },
  ]},
  { id: "sm-salmon", name: "Grilled Salmon", emoji: "🐟", mealType: "dinner", ingredients: [
    { name: "Salmon fillet", amount: 4, unit: "", category: "protein", price: 20.00 },
    { name: "Lemon", amount: 1, unit: "", category: "produce", price: 0.60 },
    { name: "Asparagus", amount: 1, unit: "bunch", category: "produce", price: 2.50 },
    { name: "Olive oil", amount: 2, unit: "tbsp", category: "pantry", price: 0.70 },
    { name: "Garlic", amount: 2, unit: "cloves", category: "produce", price: 0.40 },
  ]},
  { id: "sm-chili", name: "Chili", emoji: "🌶️", mealType: "dinner", ingredients: [
    { name: "Ground beef", amount: 1, unit: "lb", category: "protein", price: 6.00 },
    { name: "Kidney beans", amount: 2, unit: "can", category: "pantry", price: 2.40 },
    { name: "Canned tomatoes", amount: 2, unit: "can", category: "pantry", price: 3.00 },
    { name: "Onion", amount: 1, unit: "", category: "produce", price: 0.60 },
    { name: "Bell pepper", amount: 1, unit: "", category: "produce", price: 1.00 },
    { name: "Chili powder", amount: 2, unit: "tbsp", category: "other", price: 0.40 },
  ]},
  { id: "sm-curry", name: "Chicken Curry", emoji: "🍛", mealType: "dinner", ingredients: [
    { name: "Chicken breast", amount: 1, unit: "lb", category: "protein", price: 4.00 },
    { name: "Coconut milk", amount: 1, unit: "can", category: "pantry", price: 2.00 },
    { name: "Curry powder", amount: 2, unit: "tbsp", category: "other", price: 0.50 },
    { name: "Onion", amount: 1, unit: "", category: "produce", price: 0.60 },
    { name: "Garlic", amount: 3, unit: "cloves", category: "produce", price: 0.60 },
    { name: "Rice", amount: 1, unit: "cup", category: "grains", price: 0.30 },
  ]},
  { id: "sm-pizza", name: "Margherita Pizza", emoji: "🍕", mealType: "dinner", ingredients: [
    { name: "Pizza dough", amount: 1, unit: "", category: "grains", price: 3.00 },
    { name: "Mozzarella cheese", amount: 1, unit: "cup", category: "dairy", price: 1.20 },
    { name: "Tomato sauce", amount: 0.5, unit: "cup", category: "pantry", price: 1.00 },
    { name: "Basil leaves", amount: 10, unit: "leaves", category: "produce", price: 0.50 },
    { name: "Olive oil", amount: 1, unit: "tbsp", category: "pantry", price: 0.35 },
  ]},
  { id: "sm-vegsoup", name: "Vegetable Soup", emoji: "🍲", mealType: "dinner", ingredients: [
    { name: "Carrots", amount: 3, unit: "", category: "produce", price: 0.90 },
    { name: "Celery", amount: 3, unit: "stalks", category: "produce", price: 1.20 },
    { name: "Onion", amount: 1, unit: "", category: "produce", price: 0.60 },
    { name: "Potatoes", amount: 2, unit: "", category: "produce", price: 1.00 },
    { name: "Vegetable broth", amount: 4, unit: "cup", category: "pantry", price: 2.40 },
    { name: "Thyme", amount: 1, unit: "tsp", category: "other", price: 0.15 },
  ]},
  { id: "sm-bbqchicken", name: "BBQ Chicken", emoji: "🍗", mealType: "dinner", ingredients: [
    { name: "Chicken thighs", amount: 6, unit: "", category: "protein", price: 7.20 },
    { name: "BBQ sauce", amount: 1, unit: "cup", category: "pantry", price: 2.50 },
    { name: "Corn on the cob", amount: 4, unit: "", category: "produce", price: 2.80 },
    { name: "Coleslaw mix", amount: 4, unit: "cup", category: "produce", price: 4.00 },
  ]},
  { id: "sm-friedrice", name: "Fried Rice", emoji: "🍚", mealType: "dinner", ingredients: [
    { name: "Rice", amount: 3, unit: "cup", category: "grains", price: 0.90 },
    { name: "Eggs", amount: 2, unit: "", category: "protein", price: 0.70 },
    { name: "Frozen peas & carrots", amount: 1, unit: "cup", category: "produce", price: 1.00 },
    { name: "Soy sauce", amount: 3, unit: "tbsp", category: "pantry", price: 0.45 },
    { name: "Green onion", amount: 3, unit: "stalks", category: "produce", price: 0.90 },
  ]},
  { id: "sm-primavera", name: "Pasta Primavera", emoji: "🍝", mealType: "dinner", ingredients: [
    { name: "Penne pasta", amount: 1, unit: "box", category: "grains", price: 1.80 },
    { name: "Zucchini", amount: 1, unit: "", category: "produce", price: 0.90 },
    { name: "Cherry tomatoes", amount: 1, unit: "cup", category: "produce", price: 2.50 },
    { name: "Parmesan cheese", amount: 0.5, unit: "cup", category: "dairy", price: 0.75 },
    { name: "Olive oil", amount: 2, unit: "tbsp", category: "pantry", price: 0.70 },
  ]},
  { id: "sm-lentilsoup", name: "Lentil Soup", emoji: "🥣", mealType: "dinner", ingredients: [
    { name: "Lentils", amount: 1, unit: "cup", category: "pantry", price: 1.00 },
    { name: "Carrots", amount: 2, unit: "", category: "produce", price: 0.60 },
    { name: "Celery", amount: 2, unit: "stalks", category: "produce", price: 0.80 },
    { name: "Onion", amount: 1, unit: "", category: "produce", price: 0.60 },
    { name: "Vegetable broth", amount: 4, unit: "cup", category: "pantry", price: 2.40 },
    { name: "Cumin", amount: 1, unit: "tsp", category: "other", price: 0.20 },
  ]},
];

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

function buildShoppingList(assignments, includeKeys) {
  const includeSet = new Set(includeKeys);
  const buckets = {};
  Object.entries(assignments).forEach(([dKey, mealsForDay]) => {
    if (!includeSet.has(dKey)) return;
    (mealsForDay || []).forEach((meal) => {
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
            : Number(ing.amount);
        const priceNum =
          ing.price === "" || ing.price === null || ing.price === undefined || isNaN(Number(ing.price))
            ? null
            : Number(ing.price);
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

export default function App() {
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState("week"); // "week" | "month"
  const [assignments, setAssignments] = useState({});
  const [checked, setChecked] = useState(new Set());
  const [customMeals, setCustomMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageWarning, setStorageWarning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("Suggest one dinner idea in a single short sentence.");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [activeDayKey, setActiveDayKey] = useState(null);
  const [modalTab, setModalTab] = useState("suggested");
  const [search, setSearch] = useState("");
  const [showShoppingList, setShowShoppingList] = useState(false);

  const [newMealName, setNewMealName] = useState("");
  const [newMealEmoji, setNewMealEmoji] = useState("🍽️");
  const [newMealType, setNewMealType] = useState("dinner");
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

  async function testAI() {
    setAiLoading(true);
    setAiResponse("");
    try {
      const result = await askLLM(aiPrompt);
      setAiResponse(result);
    } catch (e) {
      setAiResponse(`⚠️ ${e.message}`);
    }
    setAiLoading(false);
  }

  function addMealToDay(dayKey, meal) {
    const instance = {
      name: meal.name,
      emoji: meal.emoji,
      mealType: meal.mealType,
      ingredients: meal.ingredients,
      instanceId: makeInstanceId(),
    };
    setAssignments((prev) => {
      const next = { ...prev, [dayKey]: [...(prev[dayKey] || []), instance] };
      persistAssignments(next);
      return next;
    });
    setModalTab("suggested");
    setSearch("");
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
    const meal = { id: makeCustomMealId(), name, emoji: newMealEmoji, mealType: newMealType, ingredients };
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
  const filteredLibrary = MEAL_LIBRARY.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const activeDayMeals = activeDayKey ? assignments[activeDayKey] || [] : [];
  const activeDayLabel = activeDayKey
    ? new Date(activeDayKey + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

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
        .meal-chip { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:7px 8px; display:flex; align-items:center; gap:6px; font-size:0.82rem; }
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
        .receipt-line-total { color: var(--sun-mid); font-weight:700; }
        .receipt-footer { padding:10px 22px 22px; border-top: 1px solid rgba(255,255,255,0.1); }
        .barcode { display:flex; align-items:flex-end; gap:2px; height:28px; margin-top:6px; }
        .barcode span:nth-child(odd) { background:var(--cyan); flex-shrink:0; height:100%; }
        .barcode span:nth-child(even) { background:var(--magenta-soft); flex-shrink:0; height:100%; }
        .receipt-grand-total { font-family:'Orbitron',sans-serif; font-size:1.1rem; text-align:center; margin-top:12px; color:var(--sun-core); text-shadow: 0 0 10px rgba(255,157,108,0.6); }
        .receipt-grand-note { font-family:'Space Mono',monospace; font-size:0.68rem; text-align:center; margin-top:4px; opacity:0.55; }

        .mp-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:10px; }
        .mp-warning { max-width:1100px; margin:0 auto 16px; background:rgba(255,47,120,0.15); border:1px solid var(--magenta); color:var(--text); padding:10px 14px; border-radius:10px; font-size:0.85rem; }
        .ai-test-panel { max-width:1100px; margin:0 auto 16px; background:var(--panel); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:14px 16px; }
        .ai-test-row { display:flex; gap:8px; align-items:center; }
        .ai-test-btn { width:auto; flex-shrink:0; padding:10px 20px; }
        .ai-test-response { margin-top:10px; font-family:'Space Mono',monospace; font-size:0.85rem; color:var(--text-dim); background:rgba(255,255,255,0.04); border-radius:8px; padding:10px 12px; white-space:pre-wrap; }
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
          </div>
        </div>

        {storageWarning && (
          <div className="mp-warning">Changes aren't saving right now, so your plan may reset on reload. You can keep going in the meantime.</div>
        )}

        <div className="ai-test-panel">
          <div className="mp-field-label">AI connection test (local Ollama)</div>
          <div className="ai-test-row">
            <input
              className="mp-input"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask the AI something…"
            />
            <button className="mp-primary-btn ai-test-btn" onClick={testAI} disabled={aiLoading}>
              {aiLoading ? "Thinking…" : "Ask"}
            </button>
          </div>
          {aiResponse && <div className="ai-test-response">{aiResponse}</div>}
        </div>

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
                        <span className="meal-dot" style={{ background: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color, color: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color }} />
                        <span style={{ fontSize: "1rem" }}>{m.emoji}</span>
                        <span className="meal-name">{m.name}</span>
                        <button className="meal-remove" onClick={() => removeMealFromDay(key, m.instanceId)} aria-label="Remove meal">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="add-meal-btn"
                    onClick={() => {
                      setActiveDayKey(key);
                      setModalTab("suggested");
                      setSearch("");
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
                      setSearch("");
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
                    <span className="meal-dot" style={{ background: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color, color: (MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).color }} />
                    <span style={{ fontSize: "1rem" }}>{m.emoji}</span>
                    <span className="meal-name">{m.name}</span>
                    <button className="meal-remove" onClick={() => removeMealFromDay(activeDayKey, m.instanceId)} aria-label="Remove meal">
                      <X size={14} />
                    </button>
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
                <div className="mp-search">
                  <Search size={16} color="var(--text-dim)" />
                  <input placeholder="Search meals…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="suggested-grid">
                  {filteredLibrary.map((m) => (
                    <button className="suggested-card" key={m.id} onClick={() => addMealToDay(activeDayKey, m)}>
                      <div className="suggested-emoji">{m.emoji}</div>
                      <div className="suggested-name">{m.name}</div>
                      <div className="suggested-type">{MEAL_TYPE_META[m.mealType].label}</div>
                    </button>
                  ))}
                  {filteredLibrary.length === 0 && <div className="mp-empty">No meals match "{search}".</div>}
                </div>
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
                    <div className="suggested-type">{(MEAL_TYPE_META[m.mealType] || MEAL_TYPE_META.dinner).label}</div>
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
                      return (
                        <div key={itemKey}>
                          <div className={`receipt-line${isChecked ? " done" : ""}`} onClick={() => toggleChecked(itemKey)}>
                            <span className={`receipt-check${isChecked ? " on" : ""}`}>{isChecked && <Check size={10} />}</span>
                            <span className="receipt-name">{item.name}</span>
                            <span className="receipt-dots" />
                            <span className="receipt-qty">{item.amount !== null ? `${formatAmount(item.amount)}${item.unit ? " " + item.unit : ""}` : (item.unit || "—")}</span>
                          </div>
                          <div className="receipt-price-line">
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
    </div>
  );
}
