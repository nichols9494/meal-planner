const DINNER_MEAL_NAMES = [
  "Spaghetti with Meat Sauce",
  "Chicken Tacos",
  "Baked Chicken and Rice",
  "Hamburgers and Fries",
  "Grilled Cheese and Tomato Soup",
  "Chicken Alfredo",
  "Sloppy Joes",
  "BBQ Chicken Sandwiches",
  "Chicken Quesadillas",
  "Meatloaf and Mashed Potatoes",
  "Chili and Cornbread",
  "Chicken Stir Fry with Rice",
  "Pizza Night",
  "Chicken Noodle Soup",
  "Taco Salad",
  "Ham and Cheese Sliders",
  "Beef Tacos",
  "Baked Ziti",
  "Turkey Burgers",
  "Pork Chops and Applesauce",
  "Chicken Parmesan",
  "Beef Stroganoff",
  "Lasagna",
  "Sausage and Peppers",
  "Pot Roast with Carrots",
  "Chicken Fajitas",
  "Fish Sticks and Mac and Cheese",
  "Tuna Casserole",
  "Shepherd's Pie",
  "Chicken Pot Pie",
  "Turkey Meatballs and Pasta",
  "Pulled Pork Sandwiches",
  "Beef and Bean Burritos",
  "Chicken Enchiladas",
  "Cheeseburger Macaroni",
  "Stuffed Bell Peppers",
  "Ham Steak and Green Beans",
  "Lemon Pepper Chicken",
  "Garlic Butter Shrimp Pasta",
  "Baked Salmon and Rice",
  "Crispy Chicken Tenders",
  "Hot Dogs and Baked Beans",
  "Sausage Breakfast Skillet for Dinner",
  "Beef Nachos",
  "Chicken and Dumplings",
  "Crockpot Chicken BBQ Plates",
  "Pasta Primavera",
  "Turkey Chili",
  "Chicken Fried Rice",
  "Baked Potato Bar",
];

const LUNCH_MEAL_NAMES = [
  "Turkey Club Sandwiches",
  "Tuna Melts",
  "Ham and Cheese Sandwiches",
  "Chicken Caesar Wraps",
  "Peanut Butter and Jelly Sandwiches",
  "Grilled Chicken Salad",
  "Turkey and Cheese Wraps",
  "BLT Sandwiches",
  "Chicken Salad Sandwiches",
  "Egg Salad Sandwiches",
  "Quesadilla Lunch Plates",
  "Cheese Pizza Bagels",
  "Chicken Noodle Soup Lunch",
  "Tomato Soup and Crackers",
  "Bean and Cheese Burritos",
  "Turkey Pinwheels",
  "Ham and Swiss Sliders",
  "Taco Salad Bowls",
  "Chicken Ranch Wraps",
  "Tuna Salad Plates",
  "Deli Roast Beef Sandwiches",
  "Greek Salad with Chicken",
  "Cobb Salad",
  "Meatball Subs",
  "Pasta Salad with Chicken",
  "Mac and Cheese Cups",
  "Mini Corn Dogs and Fruit",
  "Chicken Tender Wraps",
  "Turkey Avocado Sandwiches",
  "Cheeseburger Sliders",
  "Baked Potato Lunch Bowls",
  "BBQ Chicken Flatbreads",
  "Ham and Cheese Quesadillas",
  "Chicken Pita Pockets",
  "Club Salad Bowls",
  "Italian Subs",
  "Turkey Melt Sandwiches",
  "Chicken Rice Bowls",
  "Veggie Hummus Wraps",
  "Grilled Cheese Sandwiches",
  "Leftover Chili Bowls",
  "Chicken Taco Bowls",
  "Turkey Bagel Sandwiches",
  "Pizza Lunchables at Home",
  "Chicken Caesar Salad",
  "Ham Pasta Salad",
  "Tuna Pasta Salad",
  "Chicken Soup and Sandwich",
  "Roast Beef Wraps",
  "Cottage Cheese Fruit Plates",
];

const BREAKFAST_MEAL_NAMES = [
  "Pancakes and Eggs",
  "Breakfast for Dinner",
  "Scrambled Eggs and Toast",
  "Bacon Egg and Cheese Biscuits",
  "Sausage Breakfast Burritos",
  "French Toast and Bacon",
  "Waffles and Sausage",
  "Oatmeal with Bananas",
  "Yogurt Parfaits",
  "Breakfast Sandwiches",
  "Egg and Cheese English Muffins",
  "Biscuits and Gravy",
  "Hash Browns and Eggs",
  "Breakfast Tacos",
  "Cereal and Fruit",
  "Bagels with Cream Cheese",
  "Ham and Cheese Omelets",
  "Blueberry Pancakes",
  "Chocolate Chip Waffles",
  "Sausage Egg Casserole",
  "Avocado Toast and Eggs",
  "Peanut Butter Banana Toast",
  "Breakfast Pizza",
  "Mini Pancake Bites",
  "Egg Muffin Cups",
  "Cinnamon Toast and Eggs",
  "Breakfast Quesadillas",
  "Apple Cinnamon Oatmeal",
  "Granola and Yogurt Bowls",
  "Breakfast Fried Rice",
  "Cheese Grits and Eggs",
  "Sausage Pancake Stacks",
  "Banana Muffins and Yogurt",
  "Eggs and Turkey Bacon",
  "Breakfast Potatoes and Eggs",
  "Ham Egg and Cheese Croissants",
  "Strawberry Waffles",
  "Cottage Cheese and Fruit",
  "Breakfast Bagel Sandwiches",
  "Spinach and Cheese Omelets",
  "Sausage and Cheese Kolaches",
  "Oatmeal Breakfast Bars",
  "Breakfast Nachos",
  "English Muffin Pizzas",
  "Breakfast Sliders",
  "Apple Pancakes",
  "Eggs in a Basket",
  "Turkey Sausage Scramble",
  "Breakfast Rice Bowls",
  "Toast with Jelly and Eggs",
];


function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function item(name, amount, unit, category, price) {
  return { name, amount, unit, category, price };
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

const RECIPE_SOURCES = {
  foodNetworkChickenRice: {
    name: "Food Network chicken-and-rice methods",
    url: "https://www.foodnetwork.com/recipes/food-network-kitchen/the-best-chicken-and-rice-8133711",
  },
  allrecipesSpaghetti: {
    name: "Allrecipes homemade spaghetti sauce methods",
    url: "https://www.allrecipes.com/recipe/158140/spaghetti-sauce-with-ground-beef/",
  },
  budgetBytesBeginner: {
    name: "Budget Bytes beginner weeknight meal methods",
    url: "https://www.budgetbytes.com/easy-recipes-for-beginners/",
  },
  simplyQuesadilla: {
    name: "Simply Recipes easy quesadilla methods",
    url: "https://www.simplyrecipes.com/easy-quesadilla-recipes-11992662",
  },
  tasteOfHomeFamily: {
    name: "Taste of Home family dinner methods",
    url: "https://www.tasteofhome.com/collection/30-minute-meals-your-family-will-love/",
  },
  foodNetworkBreakfast: {
    name: "Food Network breakfast recipe methods",
    url: "https://www.foodnetwork.com/recipes/photos/our-best-breakfast-recipes",
  },
  simplyBreakfast: {
    name: "Simply Recipes breakfast casserole methods",
    url: "https://www.simplyrecipes.com/easy-pancake-breakfast-casserole-recipe-11931308",
  },
  eatingWellLunch: {
    name: "EatingWell quick lunch and salad methods",
    url: "https://www.eatingwell.com/high-protein-no-cook-dinner-recipes-12014210",
  },
  eatingWellPasta: {
    name: "EatingWell one-pot pasta methods",
    url: "https://www.eatingwell.com/taco-skillet-pasta-8731541",
  },
};

function sourceForMeal(name, mealType) {
  const text = name.toLowerCase();

  if (mealType === "breakfast") {
    if (includesAny(text, ["pancake", "waffle", "french toast", "casserole"])) {
      return RECIPE_SOURCES.simplyBreakfast;
    }
    return RECIPE_SOURCES.foodNetworkBreakfast;
  }

  if (mealType === "lunch") {
    return RECIPE_SOURCES.eatingWellLunch;
  }

  if (includesAny(text, ["spaghetti", "ziti", "lasagna", "marinara"])) {
    return RECIPE_SOURCES.allrecipesSpaghetti;
  }

  if (includesAny(text, ["alfredo", "pasta", "macaroni", "stroganoff", "casserole"])) {
    return RECIPE_SOURCES.eatingWellPasta;
  }

  if (includesAny(text, ["chicken and rice", "baked chicken", "rice"])) {
    return RECIPE_SOURCES.foodNetworkChickenRice;
  }

  if (includesAny(text, ["taco", "fajita", "burrito", "enchilada", "nacho", "quesadilla"])) {
    return RECIPE_SOURCES.simplyQuesadilla;
  }

  if (includesAny(text, ["sloppy", "chili", "bbq", "fried rice", "bowl"])) {
    return RECIPE_SOURCES.budgetBytesBeginner;
  }

  return RECIPE_SOURCES.tasteOfHomeFamily;
}

function emojiForMeal(name, mealType) {
  const text = name.toLowerCase();

  if (includesAny(text, ["taco", "fajita", "burrito", "enchilada", "nacho", "quesadilla"])) return "🌮";
  if (includesAny(text, ["pizza"])) return "🍕";
  if (includesAny(text, ["ziti", "lasagna", "pasta", "spaghetti", "alfredo", "macaroni", "stroganoff"])) return "🍝";
  if (includesAny(text, ["burger", "slider", "hot dog"])) return "🍔";
  if (includesAny(text, ["sandwich", "melt", "sub", "wrap", "bagel", "pinwheel", "pita"])) return "🥪";
  if (includesAny(text, ["soup", "chili", "stew", "dumpling", "pot pie"])) return "🍲";
  if (includesAny(text, ["salad", "parfait", "fruit"])) return "🥗";
  if (includesAny(text, ["pancake", "waffle", "french toast"])) return "🥞";
  if (includesAny(text, ["egg", "omelet", "scramble", "breakfast", "biscuit", "burrito", "taco"])) return "🍳";
  if (includesAny(text, ["chicken", "turkey", "pork", "meatloaf", "pot roast", "ham steak"])) return "🍗";
  if (includesAny(text, ["fish", "salmon", "tuna", "shrimp"])) return "🐟";
  if (mealType === "breakfast") return "🍳";
  if (mealType === "lunch") return "🥪";
  return "🍽️";
}

function ingredientsForMeal(name, mealType) {
  const text = name.toLowerCase();

  if (includesAny(text, ["taco", "fajita", "burrito", "enchilada", "nacho", "quesadilla"])) {
    const protein = includesAny(text, ["beef", "nacho"]) ? "Ground beef" : includesAny(text, ["bean"]) ? "Black beans" : "Chicken breast";
    return [
      item(protein, protein === "Black beans" ? 2 : 1.5, protein === "Black beans" ? "cans" : "lb", "protein", protein === "Black beans" ? 3 : 7),
      item(includesAny(text, ["nacho"]) ? "Tortilla chips" : "Tortillas", includesAny(text, ["nacho"]) ? 1 : 8, includesAny(text, ["nacho"]) ? "bag" : "count", "grains", 3),
      item("Shredded cheese", 2, "cups", "dairy", 3.5),
      item("Salsa", 1, "cup", "pantry", 2.5),
      item("Lettuce", 2, "cups", "produce", 1.5),
      item("Taco seasoning", 1, "packet", "pantry", 1.25),
    ];
  }

  if (includesAny(text, ["pizza", "bagel pizza", "flatbread"])) {
    return [
      item(includesAny(text, ["bagel"]) ? "Bagels" : includesAny(text, ["flatbread"]) ? "Flatbreads" : "Pizza crust", 2, "count", "grains", 4),
      item("Pizza sauce", 1, "cup", "pantry", 1.5),
      item("Mozzarella cheese", 2, "cups", "dairy", 3.5),
      item("Pepperoni", 4, "oz", "protein", 3),
      item("Bell pepper", 1, "count", "produce", 1),
    ];
  }

  if (includesAny(text, ["spaghetti", "alfredo", "ziti", "lasagna", "pasta", "stroganoff", "macaroni", "casserole", "primavera"])) {
    return [
      item(includesAny(text, ["rice"]) ? "Rice" : "Pasta", 1, "lb", "grains", 2),
      item(includesAny(text, ["chicken"]) ? "Chicken breast" : includesAny(text, ["tuna"]) ? "Canned tuna" : "Ground beef", 1.5, includesAny(text, ["tuna"]) ? "cans" : "lb", "protein", 7),
      item(includesAny(text, ["alfredo"]) ? "Alfredo sauce" : includesAny(text, ["stroganoff"]) ? "Cream of mushroom soup" : "Marinara sauce", 1, "jar", "pantry", 3),
      item("Shredded cheese", 2, "cups", "dairy", 3.5),
      item(includesAny(text, ["primavera"]) ? "Mixed fresh vegetables" : "Frozen vegetables", 2, "cups", "produce", 2.5),
    ];
  }

  if (includesAny(text, ["sandwich", "melt", "slider", "sub", "wrap", "pinwheel", "pita", "club", "blt"])) {
    return [
      item(includesAny(text, ["wrap", "pinwheel"]) ? "Tortillas" : includesAny(text, ["pita"]) ? "Pita pockets" : includesAny(text, ["bagel"]) ? "Bagels" : "Bread", 8, includesAny(text, ["bread"]) ? "slices" : "count", "grains", 2.5),
      item(includesAny(text, ["tuna"]) ? "Canned tuna" : includesAny(text, ["ham"]) ? "Deli ham" : includesAny(text, ["roast beef"]) ? "Deli roast beef" : includesAny(text, ["chicken"]) ? "Cooked chicken" : "Deli turkey", 1, includesAny(text, ["tuna"]) ? "cans" : "lb", "protein", 7),
      item("Cheese slices", 4, "count", "dairy", 2),
      item("Lettuce", 4, "leaves", "produce", 1),
      item("Tomato", 1, "count", "produce", 1),
      item(includesAny(text, ["ranch"]) ? "Ranch dressing" : "Mayonnaise", 0.25, "cup", "pantry", 0.75),
    ];
  }

  if (includesAny(text, ["salad", "bowl"])) {
    return [
      item(includesAny(text, ["tuna"]) ? "Canned tuna" : includesAny(text, ["turkey"]) ? "Deli turkey" : "Chicken breast", 1, includesAny(text, ["tuna"]) ? "cans" : "lb", "protein", 6),
      item("Romaine lettuce", 1, "head", "produce", 2),
      item("Tomato", 2, "count", "produce", 2),
      item("Shredded cheese", 1, "cup", "dairy", 2),
      item("Salad dressing", 0.5, "cup", "pantry", 1.5),
      item(includesAny(text, ["rice"]) ? "Rice" : "Crackers", 1, includesAny(text, ["rice"]) ? "cup" : "box", "grains", 2),
    ];
  }

  if (includesAny(text, ["soup", "chili", "dumpling", "pot pie", "stew"])) {
    return [
      item(includesAny(text, ["beef", "chili"]) ? "Ground beef" : "Chicken breast", 1.5, "lb", "protein", 7),
      item(includesAny(text, ["chili"]) ? "Crushed tomatoes" : "Chicken broth", includesAny(text, ["chili"]) ? 1 : 4, includesAny(text, ["chili"]) ? "can" : "cups", "pantry", 2),
      item("Carrots", 3, "count", "produce", 1.5),
      item("Celery", 3, "stalks", "produce", 1.5),
      item(includesAny(text, ["chili"]) ? "Beans" : includesAny(text, ["pot pie"]) ? "Pie crust" : "Noodles", 2, includesAny(text, ["chili"]) ? "cans" : includesAny(text, ["pot pie"]) ? "count" : "cups", includesAny(text, ["pot pie"]) ? "grains" : "pantry", 2.5),
      item("Onion", 1, "count", "produce", 1),
    ];
  }

  if (mealType === "breakfast") {
    if (includesAny(text, ["pancake", "waffle", "french toast"])) {
      return [
        item(includesAny(text, ["waffle"]) ? "Waffle mix" : includesAny(text, ["french toast"]) ? "Bread" : "Pancake mix", includesAny(text, ["french toast"]) ? 8 : 2, includesAny(text, ["french toast"]) ? "slices" : "cups", "pantry", 2),
        item("Eggs", 6, "count", "protein", 2.5),
        item("Milk", 2, "cups", "dairy", 1),
        item("Syrup", 0.5, "cup", "pantry", 1.5),
        item("Butter", 2, "tbsp", "dairy", 0.5),
      ];
    }

    if (includesAny(text, ["oatmeal", "granola", "yogurt", "fruit", "cottage cheese", "bars"])) {
      return [
        item(includesAny(text, ["yogurt", "parfait"]) ? "Yogurt" : includesAny(text, ["cottage"]) ? "Cottage cheese" : "Oats", 2, "cups", includesAny(text, ["oats", "oatmeal"]) ? "grains" : "dairy", 3),
        item("Bananas", 4, "count", "produce", 2),
        item("Berries", 2, "cups", "produce", 4),
        item("Granola", 2, "cups", "grains", 3.5),
        item("Honey", 2, "tbsp", "pantry", 0.75),
      ];
    }

    return [
      item("Eggs", 8, "count", "protein", 3),
      item(includesAny(text, ["sausage"]) ? "Breakfast sausage" : includesAny(text, ["bacon"]) ? "Bacon" : includesAny(text, ["turkey bacon"]) ? "Turkey bacon" : "Ham", 1, "lb", "protein", 5),
      item(includesAny(text, ["burrito", "taco", "quesadilla"]) ? "Tortillas" : includesAny(text, ["bagel"]) ? "Bagels" : includesAny(text, ["croissant"]) ? "Croissants" : "Bread", 8, includesAny(text, ["bread"]) ? "slices" : "count", "grains", 3),
      item("Shredded cheese", 1, "cup", "dairy", 2),
      item("Potatoes", 4, "count", "produce", 2.5),
    ];
  }

  return [
    item(includesAny(text, ["beef", "burger", "meatloaf", "sloppy", "pot roast"]) ? "Ground beef" : includesAny(text, ["pork"]) ? "Pork chops" : includesAny(text, ["salmon", "fish"]) ? "Salmon fillets" : includesAny(text, ["shrimp"]) ? "Shrimp" : "Chicken breast", 1.5, "lb", "protein", 7),
    item(includesAny(text, ["potato", "fries"]) ? "Potatoes" : includesAny(text, ["cornbread"]) ? "Cornbread mix" : "Rice", 2, includesAny(text, ["potato"]) ? "count" : includesAny(text, ["cornbread"]) ? "box" : "cups", includesAny(text, ["potato"]) ? "produce" : "grains", 2),
    item("Frozen vegetables", 2, "cups", "produce", 2.5),
    item("Shredded cheese", 1, "cup", "dairy", 2),
    item("Seasoning", 1, "packet", "pantry", 1),
  ];
}

const INSTRUCTIONS_BY_NAME = {
  "Spaghetti with Meat Sauce": "1. Bring salted water to a boil and cook spaghetti until al dente; reserve a little pasta water before draining.\n2. Brown ground beef with diced onion and garlic, breaking it up until no pink remains.\n3. Stir in marinara sauce, Italian seasoning, and a splash of pasta water; simmer 10 minutes so the sauce thickens.\n4. Toss spaghetti with the meat sauce until coated, then sprinkle with Parmesan or shredded cheese.\n5. Serve with a simple salad or garlic bread.",
  "Chicken Tacos": "1. Cut chicken breast into small strips and season with taco seasoning, salt, and a spoonful of oil.\n2. Cook chicken in a hot skillet until browned and cooked through, then add a splash of water and scrape up the seasoning from the pan.\n3. Warm tortillas in a dry skillet or wrapped in foil until flexible.\n4. Fill tortillas with chicken, shredded cheese, lettuce, salsa, and any family toppings.\n5. Serve with rice, beans, or chips.",
  "Baked Chicken and Rice": "1. Heat the oven to 375\u00b0F and grease a 9x13 baking dish.\n2. Spread uncooked rice, broth, seasoning, and frozen vegetables in the dish, stirring so the rice is evenly covered.\n3. Season chicken breasts or thighs with salt, pepper, garlic powder, and paprika, then lay them on top of the rice.\n4. Cover tightly with foil and bake until the rice is tender and the chicken reaches 165\u00b0F, about 45 to 55 minutes depending on thickness.\n5. Rest 5 minutes, fluff the rice around the chicken, and serve.",
  "Hamburgers and Fries": "1. Shape ground beef into four patties slightly wider than the buns and press a small dimple in the center of each.\n2. Season both sides with salt, pepper, and garlic powder.\n3. Bake or air-fry the fries until crisp while the burgers cook.\n4. Cook patties in a skillet, grill pan, or grill until browned and cooked to your preferred doneness; add cheese during the last minute.\n5. Toast buns, add lettuce, tomato, pickles, ketchup, and serve with fries.",
  "Grilled Cheese and Tomato Soup": "1. Warm tomato soup in a saucepan over medium-low heat, stirring occasionally so it does not scorch.\n2. Butter one side of each bread slice and place cheese between the unbuttered sides.\n3. Cook sandwiches in a skillet over medium heat until the bread is deeply golden and the cheese melts.\n4. Let sandwiches rest one minute, then cut into halves or sticks for dipping.\n5. Serve the hot soup with grilled cheese and crackers if desired.",
  "Chicken Alfredo": "1. Cook fettuccine or penne in salted water until al dente, saving a splash of pasta water.\n2. Season sliced chicken with salt, pepper, and garlic powder, then saut\u00e9 in a little oil until cooked through.\n3. Warm Alfredo sauce in the same skillet and loosen it with a little pasta water if needed.\n4. Toss pasta and chicken in the sauce until glossy and coated.\n5. Serve with Parmesan, black pepper, and steamed broccoli or salad.",
  "Sloppy Joes": "1. Brown ground beef in a skillet with finely diced onion, draining extra grease if needed.\n2. Stir in ketchup or tomato sauce, mustard, Worcestershire sauce, brown sugar, and a little water.\n3. Simmer until thick and spoonable, about 10 minutes, stirring often.\n4. Toast hamburger buns so they hold up to the filling.\n5. Pile the sloppy joe mixture on buns and serve with pickles, chips, or fries.",
  "BBQ Chicken Sandwiches": "1. Shred cooked chicken or simmer chicken breasts in a covered skillet with a splash of water until tender enough to shred.\n2. Stir the chicken with barbecue sauce in a saucepan and warm it until the sauce clings to the meat.\n3. Toast sandwich buns or rolls so they stay sturdy.\n4. Spoon BBQ chicken onto the buns and top with cheese, pickles, lettuce, or coleslaw.\n5. Serve with fries, baked beans, corn, or fruit.",
  "Chicken Quesadillas": "1. Dice cooked chicken and toss it with a little taco seasoning or salsa.\n2. Lay a tortilla in a skillet, sprinkle cheese over half, add chicken, then add another thin layer of cheese to help it stick.\n3. Fold the tortilla and cook over medium heat until the bottom is golden and crisp.\n4. Flip carefully and cook the second side until the cheese is melted.\n5. Rest one minute, slice into wedges, and serve with salsa and sour cream.",
  "Meatloaf and Mashed Potatoes": "1. Heat the oven to 375\u00b0F and line a loaf pan or sheet pan with parchment.\n2. Mix ground beef with breadcrumbs, egg, milk, diced onion, salt, pepper, and a little ketchup until just combined.\n3. Shape into a loaf, spread ketchup or glaze over the top, and bake until the center reaches 160\u00b0F.\n4. Boil peeled potatoes until tender, then mash with butter, milk, salt, and pepper.\n5. Slice the meatloaf after resting 10 minutes and serve with mashed potatoes and vegetables.",
  "Chili and Cornbread": "1. Brown ground beef with diced onion in a large pot until the beef is no longer pink.\n2. Add chili powder, cumin, garlic, crushed tomatoes, beans, and a little broth or water.\n3. Simmer uncovered until thick and flavorful, stirring occasionally.\n4. Bake cornbread according to the package or recipe directions while the chili cooks.\n5. Serve chili with shredded cheese, sour cream, and warm cornbread.",
  "Chicken Stir Fry with Rice": "1. Start rice first so it is ready when the stir fry finishes.\n2. Slice chicken thinly and season with salt, pepper, garlic, and a small splash of soy sauce.\n3. Cook chicken in a hot skillet or wok until browned, then transfer it to a plate.\n4. Stir-fry vegetables until crisp-tender, return chicken to the pan, and add stir-fry sauce.\n5. Serve over rice and top with green onions or sesame seeds if available.",
  "Pizza Night": "1. Heat the oven according to the pizza crust directions, usually 425\u00b0F to 450\u00b0F.\n2. Spread pizza sauce over the crust, leaving a small border around the edge.\n3. Add mozzarella cheese and toppings such as pepperoni, peppers, onions, or olives.\n4. Bake until the crust is crisp and the cheese is melted and browned in spots.\n5. Cool 3 minutes before slicing so the cheese sets.",
  "Chicken Noodle Soup": "1. Saut\u00e9 diced onion, carrots, and celery in a soup pot until the vegetables begin to soften.\n2. Add chicken broth, cooked or raw chicken, bay leaf, salt, and pepper; simmer until the chicken is cooked through.\n3. Remove chicken, shred it, and return it to the pot.\n4. Add noodles and simmer until tender, adding more broth if the soup gets too thick.\n5. Finish with parsley and serve with crackers or bread.",
  "Taco Salad": "1. Brown ground beef with taco seasoning and a splash of water until saucy and cooked through.\n2. Wash and chop lettuce, tomato, and any extra vegetables.\n3. Layer lettuce in bowls, then add warm taco meat, cheese, beans, salsa, and crushed tortilla chips.\n4. Drizzle with ranch, salsa, or taco sauce just before serving.\n5. Serve immediately so the lettuce stays crisp.",
  "Ham and Cheese Sliders": "1. Slice a pack of dinner rolls in half horizontally and place the bottom half in a baking dish.\n2. Layer deli ham and cheese over the rolls, then add the top half back on.\n3. Brush with melted butter mixed with mustard, garlic powder, and a little poppy seed or onion powder.\n4. Cover and bake at 350\u00b0F until hot, then uncover until the tops are lightly toasted.\n5. Cut into sliders and serve warm.",
  "Beef Tacos": "1. Brown ground beef in a skillet, breaking it into small crumbles.\n2. Drain excess grease, then stir in taco seasoning and a little water.\n3. Simmer until the beef is coated and the sauce thickens.\n4. Warm taco shells or tortillas, then fill with beef, cheese, lettuce, tomato, and salsa.\n5. Serve with beans, rice, or chips.",
  "Baked Ziti": "1. Cook ziti or penne in salted water until just shy of al dente.\n2. Brown ground beef or sausage with garlic, then stir in marinara sauce.\n3. Combine pasta, sauce, ricotta or cottage cheese, and part of the mozzarella in a baking dish.\n4. Top with remaining mozzarella and bake at 375\u00b0F until bubbling and browned.\n5. Rest 5 to 10 minutes before scooping so it holds together.",
  "Turkey Burgers": "1. Mix ground turkey with salt, pepper, garlic powder, and a spoonful of breadcrumbs or mayonnaise for moisture.\n2. Form patties gently without packing them too tightly.\n3. Cook in an oiled skillet or grill pan until browned on both sides and the center reaches 165\u00b0F.\n4. Melt cheese on top during the last minute if desired.\n5. Serve on toasted buns with lettuce, tomato, pickles, and a side salad or fries.",
  "Pork Chops and Applesauce": "1. Pat pork chops dry and season with salt, pepper, garlic powder, and a pinch of paprika.\n2. Sear chops in a hot skillet with oil until browned on both sides.\n3. Lower the heat, add a small splash of broth or water, cover, and cook until the pork reaches 145\u00b0F.\n4. Rest the pork for 5 minutes so it stays juicy.\n5. Serve with applesauce, green beans, and potatoes or rice.",
  "Chicken Parmesan": "1. Pound chicken cutlets to an even thickness and season with salt and pepper.\n2. Coat chicken in flour, beaten egg, and breadcrumbs mixed with Parmesan.\n3. Pan-fry until golden on both sides, then transfer to a baking dish.\n4. Top with marinara and mozzarella, then bake at 400\u00b0F until the cheese melts and the chicken reaches 165\u00b0F.\n5. Serve over spaghetti or with salad and bread.",
  "Beef Stroganoff": "1. Brown ground beef or sliced beef in a skillet with onion and garlic.\n2. Stir in mushrooms if using them, then add beef broth and a little Worcestershire sauce.\n3. Simmer until the sauce reduces slightly, then stir in sour cream off the heat so it stays creamy.\n4. Cook egg noodles separately and drain well.\n5. Spoon stroganoff over noodles and finish with parsley or black pepper.",
  "Lasagna": "1. Brown ground beef or sausage with garlic and stir in marinara sauce.\n2. Mix ricotta or cottage cheese with egg, Parmesan, and Italian seasoning.\n3. Layer sauce, noodles, cheese mixture, and mozzarella in a baking dish.\n4. Cover with foil and bake at 375\u00b0F until the noodles are tender, then uncover to brown the cheese.\n5. Rest at least 10 minutes before cutting into squares.",
  "Sausage and Peppers": "1. Slice smoked or Italian sausage into thick pieces and brown them in a large skillet.\n2. Add sliced bell peppers and onions with a little oil, salt, and pepper.\n3. Cook until the vegetables soften and the sausage is fully cooked.\n4. Stir in a little marinara or broth if you want a saucier version.\n5. Serve in rolls, over rice, or with roasted potatoes.",
  "Pot Roast with Carrots": "1. Season the roast well with salt, pepper, and garlic powder, then sear it on all sides in a Dutch oven or slow cooker insert if possible.\n2. Add carrots, onion, potatoes, beef broth, and a splash of Worcestershire sauce.\n3. Cook covered on low until the beef is fork-tender, either several hours in a slow cooker or about 3 hours in a low oven.\n4. Remove the roast and vegetables, then thicken the juices into gravy if desired.\n5. Slice or shred the beef and serve with the carrots and potatoes.",
  "Chicken Fajitas": "1. Slice chicken, bell peppers, and onions into thin strips.\n2. Season chicken with fajita seasoning, lime juice, and a small amount of oil.\n3. Cook chicken in a hot skillet until browned, then move it aside and cook peppers and onions until tender-crisp.\n4. Combine everything in the pan and squeeze a little lime over the top.\n5. Serve with warm tortillas, cheese, salsa, and sour cream.",
  "Fish Sticks and Mac and Cheese": "1. Bake or air-fry fish sticks according to the package directions until crisp.\n2. Prepare macaroni and cheese while the fish cooks, using milk and butter for a creamy sauce.\n3. Warm peas, green beans, or another easy vegetable on the side.\n4. Let fish sticks cool briefly so they stay crisp when plated.\n5. Serve with tartar sauce, ketchup, or lemon wedges.",
  "Tuna Casserole": "1. Cook egg noodles until just tender and drain them well.\n2. Stir together tuna, cream soup, milk, peas, and shredded cheese in a baking dish.\n3. Fold in noodles and season with black pepper and a little garlic powder.\n4. Top with crushed crackers or breadcrumbs and bake at 375\u00b0F until bubbling.\n5. Rest a few minutes before serving so the sauce thickens.",
  "Shepherd's Pie": "1. Brown ground beef with onion and drain any excess grease.\n2. Stir in mixed vegetables, broth, tomato paste or gravy mix, and seasonings; simmer until thick.\n3. Spread the beef mixture in a baking dish.\n4. Top with mashed potatoes and a little cheese if desired.\n5. Bake at 400\u00b0F until the filling bubbles and the potato topping is lightly browned.",
  "Chicken Pot Pie": "1. Cook diced chicken with carrots, peas, celery, and onion until the vegetables soften.\n2. Stir in butter and flour, then slowly add broth and milk to make a creamy filling.\n3. Pour the filling into a pie dish or baking dish and cover with pie crust or biscuit dough.\n4. Bake at 400\u00b0F until the topping is golden and the filling bubbles at the edges.\n5. Let stand 10 minutes before serving so the filling is not runny.",
  "Turkey Meatballs and Pasta": "1. Mix ground turkey with breadcrumbs, egg, Parmesan, garlic, salt, and Italian seasoning.\n2. Roll into meatballs and bake or pan-brown until cooked through.\n3. Simmer the meatballs in marinara sauce while pasta cooks.\n4. Toss pasta with sauce and place meatballs on top.\n5. Serve with Parmesan and a vegetable side.",
  "Pulled Pork Sandwiches": "1. Warm pulled pork in a skillet or saucepan with barbecue sauce until moist and hot.\n2. Add a splash of broth or water if the pork looks dry.\n3. Toast buns so they do not get soggy.\n4. Pile pork onto the buns and top with pickles or coleslaw.\n5. Serve with baked beans, fries, or corn.",
  "Beef and Bean Burritos": "1. Brown ground beef with taco seasoning, then stir in refried or black beans until warm.\n2. Warm large tortillas so they roll without tearing.\n3. Spoon beef and beans down the center of each tortilla and add cheese, rice, or salsa.\n4. Fold in the sides and roll tightly; toast seam-side down in a skillet if desired.\n5. Serve with lettuce, sour cream, and salsa.",
  "Chicken Enchiladas": "1. Shred cooked chicken and mix it with a little enchilada sauce and cheese.\n2. Spread a thin layer of sauce in a baking dish.\n3. Fill tortillas with chicken mixture, roll them, and place seam-side down in the dish.\n4. Cover with more enchilada sauce and cheese, then bake at 375\u00b0F until bubbly.\n5. Rest 5 minutes and serve with rice or salad.",
  "Cheeseburger Macaroni": "1. Brown ground beef in a deep skillet and season with salt, pepper, onion powder, and garlic powder.\n2. Stir in macaroni, broth or water, and a little tomato sauce or ketchup.\n3. Simmer covered until the pasta is tender, stirring often so it does not stick.\n4. Stir in shredded cheddar until creamy.\n5. Serve with pickles or a simple salad for a cheeseburger-style dinner.",
  "Stuffed Bell Peppers": "1. Cut bell peppers in half or remove the tops, then scoop out seeds.\n2. Cook ground beef with onion, garlic, cooked rice, tomato sauce, and seasoning.\n3. Fill the peppers with the beef and rice mixture and place them in a baking dish.\n4. Cover and bake at 375\u00b0F until the peppers are tender, then uncover and top with cheese.\n5. Bake a few more minutes until the cheese melts.",
  "Ham Steak and Green Beans": "1. Pat ham steak dry and sear it in a skillet until browned on both sides.\n2. Brush with a little brown sugar, mustard, or honey if you want a glaze.\n3. Warm green beans in a separate pan with butter, salt, pepper, and garlic powder.\n4. Prepare potatoes, rice, or rolls as a simple side.\n5. Slice the ham steak and serve with green beans and the side.",
  "Lemon Pepper Chicken": "1. Season chicken with lemon pepper, garlic powder, salt, and a little oil.\n2. Sear in a skillet until browned on both sides.\n3. Add a splash of broth and lemon juice, cover, and cook until the chicken reaches 165\u00b0F.\n4. Rest the chicken for a few minutes while spooning pan juices over the top.\n5. Serve with rice, broccoli, or roasted potatoes.",
  "Garlic Butter Shrimp Pasta": "1. Cook pasta in salted water and reserve a little pasta water before draining.\n2. Pat shrimp dry and season with salt, pepper, and a pinch of paprika.\n3. Saut\u00e9 garlic in butter, then add shrimp and cook just until pink.\n4. Toss pasta with shrimp, butter sauce, lemon juice, and enough pasta water to coat.\n5. Serve immediately with Parmesan and parsley if available.",
  "Baked Salmon and Rice": "1. Start rice according to package directions or place cooked rice aside for serving.\n2. Season salmon fillets with salt, pepper, lemon juice, and a little oil or butter.\n3. Bake at 400\u00b0F until salmon flakes easily, usually 10 to 15 minutes depending on thickness.\n4. Steam or roast a vegetable while the salmon cooks.\n5. Serve salmon over rice with lemon wedges and vegetables.",
  "Crispy Chicken Tenders": "1. Cut chicken breast into strips and season with salt, pepper, garlic powder, and paprika.\n2. Dip strips in flour, then beaten egg, then breadcrumbs or crushed crackers.\n3. Bake on a greased rack or air-fry until golden and the chicken reaches 165\u00b0F.\n4. Turn once during cooking for even crispness.\n5. Serve with dipping sauce, fries, and fruit or salad.",
  "Hot Dogs and Baked Beans": "1. Warm baked beans in a saucepan, stirring occasionally.\n2. Cook hot dogs on a skillet, grill, microwave, or in simmering water until hot.\n3. Toast buns lightly if desired.\n4. Place hot dogs in buns and add ketchup, mustard, relish, onions, or cheese.\n5. Serve with baked beans and chips or fruit.",
  "Sausage Breakfast Skillet for Dinner": "1. Dice potatoes and cook them in a large skillet with oil until browned and tender.\n2. Add sliced breakfast sausage and cook until hot and browned.\n3. Stir in bell peppers or onions and cook until softened.\n4. Make small wells and crack eggs into the skillet, then cover until the eggs set.\n5. Top with cheese and serve as a breakfast-for-dinner skillet.",
  "Beef Nachos": "1. Brown ground beef with taco seasoning and a splash of water until saucy.\n2. Spread tortilla chips on a sheet pan in an even layer.\n3. Top with beef, beans if using, and plenty of shredded cheese.\n4. Bake at 375\u00b0F until the cheese melts and the chips are warm.\n5. Finish with lettuce, salsa, sour cream, jalape\u00f1os, or tomatoes.",
  "Chicken and Dumplings": "1. Simmer chicken with broth, carrots, celery, onion, salt, and pepper until the chicken is tender.\n2. Remove and shred the chicken, then return it to the pot.\n3. Stir in a little milk or cream if you want a creamy broth.\n4. Drop biscuit dough or dumpling batter by spoonfuls over the simmering broth, cover, and cook until fluffy and done inside.\n5. Serve hot in bowls with plenty of broth.",
  "Crockpot Chicken BBQ Plates": "1. Place chicken breasts or thighs in the slow cooker and season with salt, pepper, and garlic powder.\n2. Pour barbecue sauce over the chicken and cook on low until tender enough to shred.\n3. Shred the chicken in the sauce and let it sit 10 minutes so it absorbs flavor.\n4. Prepare rice, potatoes, corn, or green beans as simple sides.\n5. Serve BBQ chicken on plates with the sides or on buns.",
  "Pasta Primavera": "1. Cook pasta in salted water until al dente, saving a small cup of pasta water.\n2. Saut\u00e9 zucchini, bell peppers, broccoli, carrots, or other vegetables in olive oil until crisp-tender.\n3. Add garlic and cook briefly, then toss in the drained pasta.\n4. Stir in Parmesan, a splash of pasta water, and lemon juice or Italian seasoning.\n5. Serve with extra cheese and black pepper.",
  "Turkey Chili": "1. Brown ground turkey with onion and garlic in a soup pot.\n2. Add chili powder, cumin, tomatoes, beans, and broth.\n3. Simmer until thick, stirring occasionally so the beans do not stick.\n4. Taste and adjust salt or spice level for the family.\n5. Serve with cornbread, cheese, and sour cream.",
  "Chicken Fried Rice": "1. Use cold cooked rice if possible so it fries instead of turning mushy.\n2. Cook diced chicken in a large skillet with a little oil until done, then move it aside.\n3. Scramble eggs in the pan, then add peas, carrots, and rice.\n4. Stir in soy sauce and a little butter or sesame oil, tossing until hot.\n5. Return chicken to the skillet and serve with green onions.",
  "Baked Potato Bar": "1. Scrub potatoes, prick them with a fork, and bake at 425\u00b0F until tender, about 45 to 60 minutes.\n2. Warm toppings such as chili, broccoli, bacon, or cooked chicken.\n3. Set out shredded cheese, sour cream, butter, green onions, and any family favorites.\n4. Split each potato and fluff the inside with a fork.\n5. Let everyone build their own potato with toppings.",
  "Turkey Club Sandwiches": "1. Toast bread slices until lightly crisp.\n2. Layer turkey, bacon if using, lettuce, tomato, and cheese with mayonnaise on each layer.\n3. Stack into club-style sandwiches and press gently so they hold together.\n4. Cut into halves or quarters and secure with toothpicks if needed.\n5. Serve with chips, fruit, or pickles.",
  "Tuna Melts": "1. Drain tuna and mix it with mayonnaise, a little mustard, diced celery or pickle, salt, and pepper.\n2. Spread tuna salad on bread or English muffins and top with cheese.\n3. Toast in a skillet or under the broiler until the bread is crisp and the cheese melts.\n4. Let cool one minute before cutting.\n5. Serve with tomato slices, chips, or soup.",
  "Ham and Cheese Sandwiches": "1. Lay out bread and spread a thin layer of mayonnaise or mustard on each slice.\n2. Add deli ham and cheese evenly so every bite has filling.\n3. Add lettuce, tomato, or pickles if desired.\n4. Serve cold, or grill in a skillet until the bread is toasted and cheese softens.\n5. Pack with fruit, chips, or carrots.",
  "Chicken Caesar Wraps": "1. Chop cooked chicken into bite-size pieces and toss with Caesar dressing.\n2. Add romaine lettuce, Parmesan, and crushed croutons to the chicken.\n3. Warm tortillas briefly so they roll easily.\n4. Fill each tortilla, fold in the sides, and roll tightly.\n5. Slice in half and serve right away so the lettuce stays crisp.",
  "Peanut Butter and Jelly Sandwiches": "1. Spread peanut butter all the way to the edges of one bread slice.\n2. Spread jelly or jam on the second slice, keeping it even so the sandwich is not soggy in one spot.\n3. Press slices together gently and cut into halves or quarters.\n4. For lunchboxes, use a thin peanut butter layer on both slices with jelly in the middle to reduce sogginess.\n5. Serve with fruit, yogurt, or pretzels.",
  "Grilled Chicken Salad": "1. Season chicken with salt, pepper, and garlic powder, then grill or sear until it reaches 165\u00b0F.\n2. Rest the chicken for 5 minutes before slicing.\n3. Wash and dry lettuce, then add tomatoes, cucumbers, cheese, and any crunchy toppings.\n4. Place sliced chicken on top and drizzle with dressing.\n5. Serve with crackers or bread.",
  "Turkey and Cheese Wraps": "1. Lay tortillas flat and spread with mayonnaise, mustard, or ranch.\n2. Layer turkey, cheese, lettuce, and tomato in a line across the center.\n3. Fold in the sides and roll tightly from the bottom.\n4. Slice into halves or pinwheels.\n5. Serve with fruit, chips, or pickles.",
  "BLT Sandwiches": "1. Cook bacon until crisp and drain it on paper towels.\n2. Toast bread and spread with mayonnaise.\n3. Layer lettuce, tomato slices, and bacon evenly.\n4. Season tomatoes lightly with salt and pepper.\n5. Cut sandwiches and serve while the bacon is still crisp.",
  "Chicken Salad Sandwiches": "1. Chop cooked chicken into small pieces.\n2. Mix chicken with mayonnaise, diced celery, a little mustard, salt, and pepper.\n3. Chill briefly if time allows so the flavors blend.\n4. Spoon onto bread with lettuce or tomato.\n5. Serve with crackers, fruit, or chips.",
  "Egg Salad Sandwiches": "1. Hard-boil eggs, cool them in ice water, then peel and chop.\n2. Mix eggs with mayonnaise, mustard, salt, pepper, and a little paprika.\n3. Toast bread if you want a sturdier sandwich.\n4. Spread egg salad on bread and add lettuce if desired.\n5. Serve cold with fruit or chips.",
  "Quesadilla Lunch Plates": "1. Place a tortilla in a skillet over medium heat and sprinkle cheese over half.\n2. Add cooked chicken, beans, or leftover meat in a thin layer.\n3. Fold and cook until the bottom is golden.\n4. Flip and cook until the second side is crisp and the cheese melts.\n5. Cut into wedges and serve with salsa, sour cream, and fruit.",
  "Cheese Pizza Bagels": "1. Split bagels and place them cut-side up on a baking sheet.\n2. Spread pizza sauce over each half.\n3. Top with mozzarella and any small toppings.\n4. Bake at 400\u00b0F until the cheese melts and the bagel edges are crisp.\n5. Cool briefly before serving.",
  "Chicken Noodle Soup Lunch": "1. Warm chicken broth in a saucepan with shredded chicken, carrots, and celery.\n2. Add noodles and simmer until tender.\n3. Season with salt, pepper, and a little parsley.\n4. Add more broth if the noodles absorb too much liquid.\n5. Serve with crackers or half a sandwich.",
  "Tomato Soup and Crackers": "1. Warm tomato soup slowly in a saucepan, stirring so it heats evenly.\n2. Add a splash of milk or cream if you want it smoother.\n3. Season with black pepper or basil.\n4. Portion into bowls and top with crackers right before eating.\n5. Serve with cheese toast or fruit if desired.",
  "Bean and Cheese Burritos": "1. Warm refried beans or black beans in a skillet with a little taco seasoning.\n2. Warm tortillas so they fold easily.\n3. Spread beans down the center and sprinkle with shredded cheese.\n4. Roll tightly and toast seam-side down in a skillet until the tortilla is lightly browned.\n5. Serve with salsa and lettuce.",
  "Turkey Pinwheels": "1. Spread softened cream cheese or ranch spread over tortillas.\n2. Layer turkey, cheese, and lettuce in a thin even layer.\n3. Roll tortillas tightly and chill for a few minutes if they feel loose.\n4. Slice into pinwheels with a sharp knife.\n5. Pack with fruit or vegetables.",
  "Ham and Swiss Sliders": "1. Place slider roll bottoms in a baking dish.\n2. Layer ham and Swiss cheese over the rolls and replace the tops.\n3. Brush with melted butter mixed with mustard and a pinch of garlic powder.\n4. Bake at 350\u00b0F until warm and melty.\n5. Cut apart and serve with pickles or fruit.",
  "Taco Salad Bowls": "1. Cook ground beef or chicken with taco seasoning until hot and saucy.\n2. Add lettuce to bowls and top with the warm taco meat.\n3. Add cheese, beans, corn, tomato, salsa, and crushed tortilla chips.\n4. Drizzle with ranch or salsa.\n5. Serve immediately so the chips stay crunchy.",
  "Chicken Ranch Wraps": "1. Chop cooked chicken and toss with ranch dressing.\n2. Add lettuce, tomato, shredded cheese, and bacon if using.\n3. Fill tortillas without overstuffing them.\n4. Roll tightly and slice diagonally.\n5. Serve with carrots, chips, or fruit.",
  "Tuna Salad Plates": "1. Drain tuna and mix with mayonnaise, celery, pickle, salt, and pepper.\n2. Scoop tuna salad onto a plate with lettuce or crackers.\n3. Add sliced tomatoes, cheese, or hard-boiled egg if desired.\n4. Keep chilled until serving.\n5. Serve with fruit and crackers.",
  "Deli Roast Beef Sandwiches": "1. Toast rolls or bread if you want a warm sandwich.\n2. Layer roast beef and cheese, then warm briefly in a skillet or oven until the cheese softens.\n3. Spread horseradish sauce, mayonnaise, or mustard on the bread.\n4. Add lettuce, tomato, or pickles.\n5. Serve with chips or a side salad.",
  "Greek Salad with Chicken": "1. Cook or warm chicken and slice it into strips.\n2. Chop romaine, cucumber, tomato, and red onion.\n3. Add feta, olives if using, and chicken to the greens.\n4. Toss with Greek dressing right before serving.\n5. Serve with pita or crackers.",
  "Cobb Salad": "1. Cook bacon until crisp and boil eggs until set, then cool and chop them.\n2. Arrange lettuce in bowls and top with chicken, bacon, egg, tomato, cheese, and avocado if using.\n3. Keep toppings in rows for a classic Cobb presentation.\n4. Drizzle with ranch or vinaigrette.\n5. Serve chilled with crackers or bread.",
  "Meatball Subs": "1. Warm cooked meatballs in marinara sauce until hot.\n2. Split sub rolls and toast them lightly.\n3. Add meatballs and sauce to each roll.\n4. Top with mozzarella or provolone and broil until melted.\n5. Serve with salad or chips.",
  "Pasta Salad with Chicken": "1. Cook pasta until tender, then rinse under cool water and drain well.\n2. Dice cooked chicken and chop vegetables such as peppers, cucumber, or tomatoes.\n3. Toss pasta, chicken, vegetables, cheese, and Italian dressing together.\n4. Chill at least 15 minutes if time allows.\n5. Stir again before serving.",
  "Mac and Cheese Cups": "1. Cook macaroni and cheese according to package directions or your favorite recipe.\n2. Spoon into small oven-safe cups or muffin tins if making portions.\n3. Top with a little extra cheese or breadcrumbs.\n4. Bake briefly until the tops are warm and slightly crisp.\n5. Serve with fruit or vegetables.",
  "Mini Corn Dogs and Fruit": "1. Bake or air-fry mini corn dogs according to the package directions until hot and crisp.\n2. Wash and cut fruit into bite-size pieces.\n3. Let corn dogs cool a minute before serving to kids.\n4. Add ketchup or mustard for dipping.\n5. Serve with fruit and a small vegetable side.",
  "Chicken Tender Wraps": "1. Bake or air-fry chicken tenders until crisp and hot.\n2. Warm tortillas and spread ranch, honey mustard, or barbecue sauce down the center.\n3. Add lettuce, cheese, tomato, and sliced tenders.\n4. Roll tightly and cut in half.\n5. Serve immediately so the tenders stay crunchy.",
  "Turkey Avocado Sandwiches": "1. Toast bread if desired and spread with mayonnaise or mustard.\n2. Layer turkey, cheese, sliced avocado, lettuce, and tomato.\n3. Season avocado with a pinch of salt and pepper.\n4. Close the sandwich and press gently.\n5. Serve with fruit, chips, or pickles.",
  "Cheeseburger Sliders": "1. Shape small ground beef patties and season with salt and pepper.\n2. Cook patties in a skillet until browned and cooked through.\n3. Add cheese during the last minute so it melts.\n4. Place patties on slider buns with pickles, ketchup, and mustard.\n5. Serve with fries or fruit.",
  "Baked Potato Lunch Bowls": "1. Bake or microwave potatoes until tender.\n2. Split potatoes and fluff the insides with a fork.\n3. Top with cheese, broccoli, chili, bacon, or chicken.\n4. Warm briefly until the cheese melts.\n5. Serve in bowls with sour cream or ranch.",
  "BBQ Chicken Flatbreads": "1. Heat oven to 400\u00b0F and place flatbreads on a baking sheet.\n2. Spread a thin layer of barbecue sauce over each flatbread.\n3. Top with cooked chicken, cheese, and thinly sliced onion if desired.\n4. Bake until the cheese melts and edges crisp.\n5. Slice and serve with a side salad.",
  "Ham and Cheese Quesadillas": "1. Lay a tortilla in a skillet and sprinkle cheese over half.\n2. Add chopped ham in an even layer.\n3. Fold the tortilla and cook until golden on the first side.\n4. Flip and cook until the cheese melts.\n5. Cut into wedges and serve with fruit or salsa.",
  "Chicken Pita Pockets": "1. Warm pita pockets briefly so they open without tearing.\n2. Fill with chopped cooked chicken, lettuce, tomato, cucumber, and cheese.\n3. Drizzle with ranch, Caesar, or tzatziki-style sauce.\n4. Press gently so the filling settles into the pocket.\n5. Serve with fruit or chips.",
  "Club Salad Bowls": "1. Chop turkey, ham, cheese, lettuce, tomato, and cooked bacon.\n2. Place lettuce in bowls and arrange the toppings over it.\n3. Add croutons or crackers for crunch.\n4. Drizzle with ranch or honey mustard.\n5. Serve chilled as a fork-and-knife club sandwich.",
  "Italian Subs": "1. Split sub rolls and spread with mayonnaise or Italian dressing.\n2. Layer ham, salami or turkey, provolone, lettuce, tomato, and onion.\n3. Sprinkle with Italian seasoning and a little extra dressing.\n4. Close and press the sandwich gently.\n5. Serve cold or toast briefly for a warm sub.",
  "Turkey Melt Sandwiches": "1. Butter the outside of bread slices and layer turkey and cheese inside.\n2. Cook in a skillet over medium heat until the first side is golden.\n3. Flip and cook until the cheese melts and the second side browns.\n4. Let rest one minute before slicing.\n5. Serve with soup or fruit.",
  "Chicken Rice Bowls": "1. Warm cooked rice and season lightly with salt or a splash of soy sauce.\n2. Cook or reheat diced chicken until hot.\n3. Add steamed vegetables, shredded cheese, salsa, or teriyaki sauce depending on flavor preference.\n4. Layer rice, chicken, and toppings in bowls.\n5. Serve warm and let everyone choose extra sauce.",
  "Veggie Hummus Wraps": "1. Spread hummus over tortillas in an even layer.\n2. Add sliced cucumber, bell pepper, lettuce, shredded carrots, and cheese if desired.\n3. Keep vegetables in a tight line so the wrap rolls cleanly.\n4. Roll tightly and slice in half.\n5. Serve with fruit or pretzels.",
  "Grilled Cheese Sandwiches": "1. Butter the outside of each bread slice and place cheese in the middle.\n2. Cook in a skillet over medium heat until the first side is golden.\n3. Flip and continue cooking until the cheese melts fully.\n4. Rest briefly before cutting so the cheese does not spill out.\n5. Serve with tomato soup, fruit, or pickles.",
  "Leftover Chili Bowls": "1. Warm leftover chili in a saucepan until bubbling gently.\n2. Add a splash of water or broth if it thickened overnight.\n3. Spoon chili over rice, chips, or a baked potato.\n4. Top with cheese, sour cream, onions, or crackers.\n5. Serve hot.",
  "Chicken Taco Bowls": "1. Cook diced chicken with taco seasoning and a splash of water.\n2. Warm rice and beans separately.\n3. Layer rice, beans, chicken, lettuce, cheese, salsa, and corn in bowls.\n4. Add sour cream or avocado if desired.\n5. Serve with tortilla chips.",
  "Turkey Bagel Sandwiches": "1. Split and toast bagels until lightly crisp.\n2. Spread cream cheese, mayonnaise, or mustard on the cut sides.\n3. Layer turkey, cheese, lettuce, and tomato.\n4. Season tomato with a little salt and pepper.\n5. Serve with fruit or chips.",
  "Pizza Lunchables at Home": "1. Lay crackers, mini pitas, or small flatbreads on a plate.\n2. Spoon pizza sauce into a small cup.\n3. Add shredded cheese and pepperoni or vegetables in separate piles.\n4. Let everyone build mini pizzas cold, or microwave assembled pieces briefly.\n5. Pack with fruit or vegetables.",
  "Chicken Caesar Salad": "1. Cook or warm chicken and slice into strips.\n2. Chop romaine and toss with Caesar dressing.\n3. Add Parmesan and croutons.\n4. Place chicken on top and add black pepper.\n5. Serve immediately so croutons stay crunchy.",
  "Ham Pasta Salad": "1. Cook pasta, rinse under cool water, and drain well.\n2. Dice ham, cheese, and vegetables such as peas or bell peppers.\n3. Toss pasta with ham, vegetables, cheese, and ranch or Italian dressing.\n4. Chill before serving if possible.\n5. Stir again and add a splash more dressing if dry.",
  "Tuna Pasta Salad": "1. Cook pasta until tender, then rinse and drain.\n2. Drain tuna and break it into flakes.\n3. Mix pasta with tuna, peas, celery, mayonnaise, and a little mustard.\n4. Season with salt, pepper, and paprika.\n5. Serve chilled with crackers or fruit.",
  "Chicken Soup and Sandwich": "1. Warm chicken soup in a saucepan until hot.\n2. Prepare a simple sandwich with turkey, ham, grilled cheese, or chicken salad.\n3. Toast the sandwich if serving it warm.\n4. Taste the soup and adjust seasoning.\n5. Serve the soup with the sandwich for dipping or on the side.",
  "Roast Beef Wraps": "1. Spread a tortilla with mayonnaise, mustard, or horseradish sauce.\n2. Layer roast beef, cheese, lettuce, and tomato down the center.\n3. Fold in the sides and roll tightly.\n4. Slice in half on a diagonal.\n5. Serve with chips, pickles, or fruit.",
  "Cottage Cheese Fruit Plates": "1. Spoon cottage cheese onto plates or bowls.\n2. Wash and slice fruit such as berries, peaches, pineapple, or bananas.\n3. Arrange fruit around the cottage cheese.\n4. Add granola, toast, or crackers if you want more crunch.\n5. Serve cold.",
  "Pancakes and Eggs": "1. Mix pancake batter until just combined; a few lumps are fine.\n2. Cook pancakes on a greased griddle until bubbles form, then flip and brown the other side.\n3. Whisk eggs with salt and a splash of milk.\n4. Scramble eggs gently in a buttered skillet until just set.\n5. Serve pancakes with syrup and eggs on the side.",
  "Breakfast for Dinner": "1. Choose pancakes, eggs, bacon, sausage, and hash browns as the base.\n2. Start bacon or sausage first so it has time to cook and drain.\n3. Cook pancakes or waffles while breakfast potatoes crisp in another pan.\n4. Scramble or fry eggs last so they stay hot.\n5. Serve everything family-style with syrup, fruit, and toast.",
  "Scrambled Eggs and Toast": "1. Whisk eggs with salt, pepper, and a splash of milk.\n2. Melt butter in a nonstick skillet over medium-low heat.\n3. Cook eggs slowly, stirring with a spatula until soft curds form.\n4. Toast bread and butter it while the eggs finish.\n5. Serve immediately with fruit or breakfast meat.",
  "Bacon Egg and Cheese Biscuits": "1. Bake biscuits until golden, or warm split biscuits if using premade ones.\n2. Cook bacon until crisp and drain it on paper towels.\n3. Scramble or fry eggs to fit inside the biscuits.\n4. Layer egg, bacon, and cheese on each biscuit and warm briefly so the cheese melts.\n5. Serve with fruit or hash browns.",
  "Sausage Breakfast Burritos": "1. Brown breakfast sausage in a skillet and break it into small crumbles.\n2. Scramble eggs in the same pan after draining extra grease.\n3. Warm tortillas until flexible.\n4. Fill tortillas with sausage, eggs, cheese, and salsa.\n5. Roll tightly and toast seam-side down if desired.",
  "French Toast and Bacon": "1. Whisk eggs, milk, cinnamon, vanilla, and a pinch of sugar in a shallow bowl.\n2. Dip bread slices quickly on both sides.\n3. Cook in a buttered skillet until golden and cooked through.\n4. Cook bacon separately until crisp.\n5. Serve French toast with syrup and bacon.",
  "Waffles and Sausage": "1. Preheat the waffle iron and grease it lightly.\n2. Mix waffle batter according to the package or recipe directions.\n3. Cook waffles until crisp and golden.\n4. Brown sausage links or patties in a skillet while waffles cook.\n5. Serve with butter, syrup, and fruit.",
  "Oatmeal with Bananas": "1. Bring milk or water to a simmer with a pinch of salt.\n2. Stir in oats and cook until creamy.\n3. Slice bananas and stir half into the oatmeal near the end so they soften.\n4. Spoon into bowls and top with remaining bananas, cinnamon, and honey.\n5. Serve warm.",
  "Yogurt Parfaits": "1. Spoon yogurt into glasses or bowls.\n2. Add a layer of berries or sliced fruit.\n3. Sprinkle granola over the fruit.\n4. Repeat layers if the bowl is tall enough.\n5. Drizzle with honey and serve immediately.",
  "Breakfast Sandwiches": "1. Toast English muffins, biscuits, or bread.\n2. Cook eggs in rounds or folded squares to fit the bread.\n3. Cook bacon, sausage, or ham until hot.\n4. Layer egg, meat, and cheese on the toasted bread.\n5. Wrap briefly in foil or warm in the skillet until cheese melts.",
  "Egg and Cheese English Muffins": "1. Split and toast English muffins.\n2. Cook eggs in a greased skillet, folding them to fit the muffins.\n3. Place cheese on the hot eggs so it softens.\n4. Assemble eggs and cheese on the muffins.\n5. Serve with fruit or yogurt.",
  "Biscuits and Gravy": "1. Bake biscuits until golden and split them open.\n2. Brown breakfast sausage in a skillet, leaving some drippings in the pan.\n3. Sprinkle flour over the sausage and stir until absorbed.\n4. Slowly add milk and simmer until the gravy thickens.\n5. Spoon gravy over biscuits and serve hot.",
  "Hash Browns and Eggs": "1. Cook hash browns in a hot oiled skillet until crisp on the bottom.\n2. Flip or stir and continue cooking until browned and tender.\n3. Season with salt, pepper, and a little garlic powder.\n4. Cook eggs separately fried, scrambled, or over easy.\n5. Serve eggs over or beside the hash browns.",
  "Breakfast Tacos": "1. Scramble eggs with salt and pepper until soft.\n2. Cook bacon, sausage, or potatoes separately until browned.\n3. Warm tortillas in a dry skillet.\n4. Fill tortillas with eggs, meat or potatoes, cheese, and salsa.\n5. Serve with fruit or beans.",
  "Cereal and Fruit": "1. Wash and slice fruit before pouring cereal so everything stays crisp.\n2. Add cereal to bowls.\n3. Pour milk over the cereal just before eating.\n4. Top with fruit if desired.\n5. Serve right away with yogurt or toast for a fuller breakfast.",
  "Bagels with Cream Cheese": "1. Split bagels and toast them to your preferred crispness.\n2. Let them cool for a few seconds so the cream cheese does not melt completely.\n3. Spread cream cheese evenly on each half.\n4. Add fruit, smoked turkey, cucumber, or jam if desired.\n5. Serve with juice, coffee, or fruit.",
  "Ham and Cheese Omelets": "1. Whisk eggs with salt, pepper, and a splash of milk.\n2. Warm diced ham in a nonstick skillet.\n3. Pour eggs over the ham and cook until mostly set.\n4. Add cheese, fold the omelet, and cook until melted inside.\n5. Serve with toast or fruit.",
  "Blueberry Pancakes": "1. Mix pancake batter gently, then fold in blueberries.\n2. Heat a greased griddle over medium heat.\n3. Pour batter and cook until bubbles appear and edges look set.\n4. Flip carefully and cook until golden.\n5. Serve with butter, syrup, and extra blueberries.",
  "Chocolate Chip Waffles": "1. Preheat and grease the waffle iron.\n2. Prepare waffle batter and fold in chocolate chips.\n3. Cook waffles until crisp outside and cooked through.\n4. Keep finished waffles warm in a low oven if making several.\n5. Serve with syrup, fruit, or whipped cream.",
  "Sausage Egg Casserole": "1. Brown breakfast sausage and drain extra grease.\n2. Whisk eggs with milk, salt, pepper, and shredded cheese.\n3. Layer sausage and bread cubes or hash browns in a greased baking dish.\n4. Pour egg mixture over the top and bake at 350\u00b0F until set in the center.\n5. Rest 5 minutes before cutting.",
  "Avocado Toast and Eggs": "1. Toast bread until sturdy and golden.\n2. Mash avocado with salt, pepper, and a little lemon or lime juice.\n3. Cook eggs fried, scrambled, or poached.\n4. Spread avocado over toast and place eggs on top.\n5. Finish with pepper flakes or everything seasoning.",
  "Peanut Butter Banana Toast": "1. Toast bread until crisp.\n2. Spread peanut butter over each slice while warm.\n3. Add sliced bananas in an even layer.\n4. Drizzle with honey or sprinkle cinnamon if desired.\n5. Serve with milk or yogurt.",
  "Breakfast Pizza": "1. Heat oven to 400\u00b0F and place a pizza crust or flatbread on a sheet pan.\n2. Spread with a thin layer of gravy, cream cheese, or sauce.\n3. Add scrambled eggs, cooked sausage or bacon, and shredded cheese.\n4. Bake until the cheese melts and the crust crisps.\n5. Slice and serve warm.",
  "Mini Pancake Bites": "1. Prepare pancake batter and pour small spoonfuls onto a greased griddle.\n2. Add blueberries or chocolate chips to each mini pancake if desired.\n3. Flip when bubbles form and cook until golden.\n4. Keep warm on a plate while finishing the batch.\n5. Serve with syrup for dipping.",
  "Egg Muffin Cups": "1. Heat oven to 350\u00b0F and grease a muffin tin.\n2. Whisk eggs with salt, pepper, cheese, and chopped ham or vegetables.\n3. Pour into muffin cups, filling each about three-quarters full.\n4. Bake until puffed and set in the center.\n5. Cool slightly before removing from the tin.",
  "Cinnamon Toast and Eggs": "1. Toast bread and spread with butter while hot.\n2. Sprinkle with cinnamon sugar.\n3. Whisk eggs with salt and pepper.\n4. Scramble eggs gently in a buttered skillet.\n5. Serve cinnamon toast with eggs and fruit.",
  "Breakfast Quesadillas": "1. Scramble eggs until just set and set them aside.\n2. Place a tortilla in a skillet and add cheese, eggs, and cooked sausage or bacon.\n3. Fold and cook until the bottom is crisp.\n4. Flip and cook until the cheese melts.\n5. Slice and serve with salsa.",
  "Apple Cinnamon Oatmeal": "1. Dice apples and simmer them with a little butter, cinnamon, and water until slightly soft.\n2. Add oats, milk or water, and a pinch of salt.\n3. Cook until creamy, stirring often.\n4. Sweeten with brown sugar or honey.\n5. Top with extra apples or nuts.",
  "Granola and Yogurt Bowls": "1. Spoon yogurt into bowls.\n2. Top with granola in an even layer.\n3. Add sliced bananas, berries, or apples.\n4. Drizzle with honey or maple syrup.\n5. Serve immediately so the granola stays crunchy.",
  "Breakfast Fried Rice": "1. Use cold cooked rice for the best texture.\n2. Scramble eggs in a large skillet and move them to the side.\n3. Add diced ham, sausage, or bacon with peas and carrots.\n4. Stir in rice and a small splash of soy sauce.\n5. Fold eggs back in and serve hot.",
  "Cheese Grits and Eggs": "1. Bring water or milk to a simmer and whisk in grits slowly.\n2. Cook, stirring often, until thick and creamy.\n3. Stir in butter and shredded cheese.\n4. Cook eggs separately fried or scrambled.\n5. Serve eggs over the cheese grits.",
  "Sausage Pancake Stacks": "1. Cook sausage patties until browned and cooked through.\n2. Prepare small pancakes on a griddle.\n3. Stack pancakes with sausage between layers or serve side by side.\n4. Add butter and syrup over the top.\n5. Serve with fruit.",
  "Banana Muffins and Yogurt": "1. Warm banana muffins or bake them ahead of time until golden.\n2. Let muffins cool slightly so they hold together.\n3. Spoon yogurt into bowls.\n4. Add fruit or granola to the yogurt if desired.\n5. Serve muffins with yogurt for a simple breakfast plate.",
  "Eggs and Turkey Bacon": "1. Cook turkey bacon in a skillet until browned and crisp at the edges.\n2. Whisk eggs with salt, pepper, and a splash of milk.\n3. Scramble eggs gently in a nonstick skillet.\n4. Toast bread or warm fruit on the side if desired.\n5. Serve eggs with turkey bacon while hot.",
  "Breakfast Potatoes and Eggs": "1. Dice potatoes small so they cook evenly.\n2. Cook potatoes in oil with salt, pepper, onion powder, and paprika until browned and tender.\n3. Stir occasionally but let them sit long enough to crisp.\n4. Cook eggs separately or make wells in the potatoes and crack eggs into the skillet.\n5. Serve with salsa or ketchup.",
  "Ham Egg and Cheese Croissants": "1. Slice croissants in half and warm them lightly.\n2. Scramble or fry eggs to fit inside the croissants.\n3. Warm ham in the skillet for a few seconds.\n4. Layer ham, egg, and cheese on each croissant.\n5. Heat briefly until the cheese melts.",
  "Strawberry Waffles": "1. Cook waffles in a preheated waffle iron until crisp.\n2. Slice strawberries and toss with a tiny bit of sugar if you want them juicy.\n3. Keep waffles warm while finishing the batch.\n4. Top waffles with strawberries, syrup, and whipped cream if desired.\n5. Serve immediately.",
  "Cottage Cheese and Fruit": "1. Spoon cottage cheese into bowls.\n2. Wash and slice fruit into bite-size pieces.\n3. Arrange fruit over or beside the cottage cheese.\n4. Add granola or toast if you want crunch.\n5. Serve chilled.",
  "Breakfast Bagel Sandwiches": "1. Toast bagels until lightly crisp.\n2. Cook eggs in a skillet and fold them to fit the bagel.\n3. Warm bacon, sausage, or ham if using.\n4. Layer egg, cheese, and meat on the bagel.\n5. Serve warm with fruit.",
  "Spinach and Cheese Omelets": "1. Wilt spinach in a skillet with a little butter or oil.\n2. Whisk eggs with salt and pepper.\n3. Pour eggs over the spinach and cook until mostly set.\n4. Add cheese, fold the omelet, and let the cheese melt.\n5. Serve with toast.",
  "Sausage and Cheese Kolaches": "1. Warm kolache dough or refrigerated biscuit dough according to package directions.\n2. Place cooked sausage and cheese inside each piece of dough.\n3. Seal the dough around the filling.\n4. Bake until the bread is golden and the cheese is melted.\n5. Cool slightly before eating.",
  "Oatmeal Breakfast Bars": "1. Mix oats with mashed banana, peanut butter, honey, and a little milk until thick.\n2. Press mixture into a lined baking dish.\n3. Bake at 350\u00b0F until set and lightly browned at the edges.\n4. Cool before cutting into bars.\n5. Serve with yogurt or fruit.",
  "Breakfast Nachos": "1. Spread tortilla chips or breakfast potatoes on a sheet pan.\n2. Top with scrambled eggs, cooked sausage or bacon, and cheese.\n3. Bake until the cheese melts.\n4. Add salsa, avocado, or sour cream after baking.\n5. Serve right away while the base is crisp.",
  "English Muffin Pizzas": "1. Split English muffins and place them cut-side up on a baking sheet.\n2. Spread pizza sauce on each half.\n3. Top with cheese and small breakfast toppings such as egg, ham, or sausage.\n4. Bake at 400\u00b0F until cheese melts and edges crisp.\n5. Cool briefly before serving.",
  "Breakfast Sliders": "1. Split slider rolls and place the bottoms in a baking dish.\n2. Layer scrambled eggs, cooked sausage or bacon, and cheese over the rolls.\n3. Add the roll tops and brush with melted butter.\n4. Bake at 350\u00b0F until warmed through and melty.\n5. Cut apart and serve.",
  "Apple Pancakes": "1. Dice or grate apples and toss with cinnamon.\n2. Mix pancake batter and fold in the apples.\n3. Cook on a greased griddle until bubbles form.\n4. Flip and cook until golden and the apples soften.\n5. Serve with syrup or powdered sugar.",
  "Eggs in a Basket": "1. Cut a hole from the center of each bread slice.\n2. Butter the bread and place it in a skillet.\n3. Crack an egg into each hole and season with salt and pepper.\n4. Cook until the bottom is toasted, then flip carefully if you want the egg more set.\n5. Serve with the toasted bread centers.",
  "Turkey Sausage Scramble": "1. Brown turkey sausage in a skillet and break it into crumbles.\n2. Add diced peppers or spinach if using and cook until softened.\n3. Whisk eggs and pour them into the skillet.\n4. Stir gently until eggs are set and mixed with the sausage.\n5. Top with cheese and serve with toast.",
  "Breakfast Rice Bowls": "1. Warm cooked rice in a skillet with a little butter or oil.\n2. Cook eggs scrambled or fried.\n3. Add breakfast sausage, ham, or bacon to the rice if desired.\n4. Place rice in bowls and top with eggs and cheese.\n5. Serve with salsa or soy sauce depending on the flavor you want.",
  "Toast with Jelly and Eggs": "1. Toast bread until golden and spread with butter and jelly.\n2. Whisk eggs with salt and pepper.\n3. Cook eggs scrambled, fried, or over easy.\n4. Plate eggs with the toast.\n5. Serve with fruit or breakfast meat if desired.",
};

function instructionsForMeal(name, mealType) {
  return INSTRUCTIONS_BY_NAME[name] || `1. Prep the ingredients for ${name}.\n2. Cook each component until done and seasoned.\n3. Combine the finished parts as appropriate for the dish.\n4. Taste and adjust salt, pepper, sauce, or toppings.\n5. Serve warm and family-style.`;
}

function makePreloadedMeal(name, mealType, index) {
  const source = sourceForMeal(name, mealType);

  return {
    id: `preloaded-${mealType}-${String(index + 1).padStart(2, "0")}-${slugify(name)}`,
    name,
    emoji: emojiForMeal(name, mealType),
    mealType,
    baseServings: 4,
    ingredients: ingredientsForMeal(name, mealType),
    instructions: instructionsForMeal(name, mealType),
    sourceName: source.name,
    sourceUrl: source.url,
  };
}

export const PRELOADED_MEALS = [
  ...DINNER_MEAL_NAMES.map((name, index) => makePreloadedMeal(name, "dinner", index)),
  ...LUNCH_MEAL_NAMES.map((name, index) => makePreloadedMeal(name, "lunch", index)),
  ...BREAKFAST_MEAL_NAMES.map((name, index) => makePreloadedMeal(name, "breakfast", index)),
];
