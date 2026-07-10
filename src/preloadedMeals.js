function slugify(value) {
  return String(value || "meal")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RAW_PRELOADED_MEALS = [
  {
    "name": "Spaghetti with Meat Sauce",
    "emoji": "\ud83c\udf5d",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Spaghetti",
        "amount": 1,
        "unit": "lb",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Ground beef",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.5
      },
      {
        "name": "Marinara sauce",
        "amount": 1,
        "unit": "jar",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Onion",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 0.8
      },
      {
        "name": "Garlic",
        "amount": 3,
        "unit": "cloves",
        "category": "produce",
        "price": 0.3
      },
      {
        "name": "Parmesan cheese",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      }
    ],
    "instructions": "1. Bring a large pot of salted water to a boil and cook the spaghetti until tender.\n2. Brown the ground beef in a skillet, breaking it up as it cooks; drain extra grease.\n3. Add diced onion and minced garlic to the beef and cook until softened.\n4. Stir in marinara sauce and simmer for 10 minutes while the pasta finishes.\n5. Toss spaghetti with sauce and serve with Parmesan."
  },
  {
    "name": "Baked Chicken and Rice",
    "emoji": "\ud83c\udf57",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Chicken thighs",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Rice",
        "amount": 1.5,
        "unit": "cups",
        "category": "grains",
        "price": 1.5
      },
      {
        "name": "Chicken broth",
        "amount": 3,
        "unit": "cups",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Cream of chicken soup",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 1.75
      },
      {
        "name": "Frozen peas and carrots",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Paprika",
        "amount": 1,
        "unit": "tsp",
        "category": "pantry",
        "price": 0.2
      }
    ],
    "instructions": "1. Heat the oven to 375\u00b0F and grease a baking dish.\n2. Stir rice, broth, cream of chicken soup, peas, and carrots together in the dish.\n3. Place chicken thighs on top and season with paprika, salt, and pepper.\n4. Cover tightly with foil and bake until the rice is tender and chicken is cooked through, about 45 minutes.\n5. Rest 5 minutes, fluff the rice around the chicken, and serve."
  },
  {
    "name": "Chicken Tacos",
    "emoji": "\ud83c\udf2e",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Taco seasoning",
        "amount": 1,
        "unit": "packet",
        "category": "pantry",
        "price": 1.25
      },
      {
        "name": "Tortillas",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Shredded lettuce",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 1.5
      },
      {
        "name": "Shredded cheddar",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Salsa",
        "amount": 1,
        "unit": "cup",
        "category": "pantry",
        "price": 2.0
      }
    ],
    "instructions": "1. Slice the chicken into strips and cook in a skillet over medium heat.\n2. Sprinkle in taco seasoning with a splash of water and simmer until coated.\n3. Warm tortillas in a dry skillet or microwave.\n4. Fill each tortilla with chicken, lettuce, cheese, and salsa.\n5. Serve with chips, rice, or beans."
  },
  {
    "name": "Beef Tacos",
    "emoji": "\ud83c\udf2e",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.5
      },
      {
        "name": "Taco seasoning",
        "amount": 1,
        "unit": "packet",
        "category": "pantry",
        "price": 1.25
      },
      {
        "name": "Taco shells",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Shredded lettuce",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 1.5
      },
      {
        "name": "Shredded cheddar",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Diced tomatoes",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 1.0
      }
    ],
    "instructions": "1. Brown ground beef in a skillet and drain excess grease.\n2. Stir in taco seasoning and a little water, then simmer until thickened.\n3. Warm taco shells according to the package directions.\n4. Fill shells with beef, lettuce, cheddar, and tomatoes.\n5. Serve immediately so the shells stay crisp."
  },
  {
    "name": "Hamburgers and Oven Fries",
    "emoji": "\ud83c\udf54",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 8.0
      },
      {
        "name": "Hamburger buns",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Potatoes",
        "amount": 4,
        "unit": "count",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Cheese slices",
        "amount": 4,
        "unit": "count",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Lettuce",
        "amount": 4,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Tomato",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      }
    ],
    "instructions": "1. Cut potatoes into wedges, toss with oil, salt, and pepper, and bake at 425\u00b0F until browned.\n2. Shape ground beef into four patties and season both sides.\n3. Cook patties in a skillet or on a grill until browned and cooked through.\n4. Add cheese during the last minute so it melts.\n5. Build burgers on buns with lettuce and tomato, then serve with oven fries."
  },
  {
    "name": "Hot Dogs and Baked Beans",
    "emoji": "\ud83c\udf2d",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Hot dogs",
        "amount": 8,
        "unit": "count",
        "category": "protein",
        "price": 4.0
      },
      {
        "name": "Hot dog buns",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Baked beans",
        "amount": 2,
        "unit": "cans",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Ketchup",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.5
      },
      {
        "name": "Mustard",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.5
      },
      {
        "name": "Relish",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      }
    ],
    "instructions": "1. Warm baked beans in a saucepan over medium-low heat, stirring occasionally.\n2. Cook hot dogs in a skillet, on a grill, or in simmering water until hot.\n3. Toast the buns lightly if desired.\n4. Place hot dogs in buns and set out ketchup, mustard, and relish.\n5. Serve with baked beans and chips or fruit."
  },
  {
    "name": "BBQ Chicken Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Cooked shredded chicken",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "BBQ sauce",
        "amount": 1,
        "unit": "cup",
        "category": "pantry",
        "price": 2.5
      },
      {
        "name": "Sandwich buns",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Coleslaw mix",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Mayonnaise",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      },
      {
        "name": "Pickles",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      }
    ],
    "instructions": "1. Combine shredded chicken and BBQ sauce in a skillet over medium heat.\n2. Warm the chicken until saucy and hot, stirring often so it does not stick.\n3. Toss coleslaw mix with mayonnaise, salt, and pepper for a quick slaw.\n4. Toast sandwich buns if you like them sturdier.\n5. Pile BBQ chicken onto buns and top with slaw and pickles."
  },
  {
    "name": "Grilled Cheese and Tomato Soup",
    "emoji": "\ud83e\udd6a",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Cheddar cheese slices",
        "amount": 8,
        "unit": "count",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Butter",
        "amount": 4,
        "unit": "tbsp",
        "category": "dairy",
        "price": 1.0
      },
      {
        "name": "Tomato soup",
        "amount": 2,
        "unit": "cans",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Milk",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 0.75
      }
    ],
    "instructions": "1. Warm tomato soup in a saucepan with milk, stirring until smooth.\n2. Butter one side of each bread slice.\n3. Build cheese sandwiches with the buttered sides facing out.\n4. Cook in a skillet over medium heat until both sides are golden and the cheese melts.\n5. Cut sandwiches in half and serve with hot soup."
  },
  {
    "name": "Chicken Alfredo",
    "emoji": "\ud83c\udf5d",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Fettuccine",
        "amount": 1,
        "unit": "lb",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Chicken breast",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Alfredo sauce",
        "amount": 1,
        "unit": "jar",
        "category": "pantry",
        "price": 3.5
      },
      {
        "name": "Broccoli",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Parmesan cheese",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      }
    ],
    "instructions": "1. Cook fettuccine in salted water and add broccoli during the last few minutes.\n2. Cut chicken into bite-size pieces and cook in a skillet until browned and cooked through.\n3. Pour Alfredo sauce into the skillet and warm gently.\n4. Drain pasta and broccoli, then toss with the chicken and sauce.\n5. Finish with Parmesan and black pepper."
  },
  {
    "name": "Sloppy Joes",
    "emoji": "\ud83e\udd6a",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.5
      },
      {
        "name": "Hamburger buns",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Tomato sauce",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Ketchup",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.5
      },
      {
        "name": "Brown sugar",
        "amount": 1,
        "unit": "tbsp",
        "category": "pantry",
        "price": 0.1
      },
      {
        "name": "Onion",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 0.8
      }
    ],
    "instructions": "1. Brown ground beef with diced onion in a skillet.\n2. Drain grease, then stir in tomato sauce, ketchup, brown sugar, salt, and pepper.\n3. Simmer 10 minutes until the sauce thickens.\n4. Toast buns if desired so they hold up better.\n5. Spoon the sloppy joe filling onto buns and serve with pickles or chips."
  },
  {
    "name": "Meatloaf and Mashed Potatoes",
    "emoji": "\ud83c\udf7d\ufe0f",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 8.0
      },
      {
        "name": "Breadcrumbs",
        "amount": 0.75,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      },
      {
        "name": "Egg",
        "amount": 1,
        "unit": "count",
        "category": "protein",
        "price": 0.4
      },
      {
        "name": "Ketchup",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      },
      {
        "name": "Potatoes",
        "amount": 5,
        "unit": "count",
        "category": "produce",
        "price": 2.5
      },
      {
        "name": "Milk",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 0.4
      }
    ],
    "instructions": "1. Heat oven to 375\u00b0F and mix beef, breadcrumbs, egg, half the ketchup, salt, and pepper.\n2. Shape into a loaf and place in a baking dish.\n3. Spread remaining ketchup on top and bake until cooked through.\n4. Boil peeled potatoes until tender, then mash with milk, butter, salt, and pepper.\n5. Slice meatloaf and serve with mashed potatoes."
  },
  {
    "name": "Chili and Cornbread",
    "emoji": "\ud83c\udf36\ufe0f",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.5
      },
      {
        "name": "Kidney beans",
        "amount": 2,
        "unit": "cans",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Crushed tomatoes",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Chili seasoning",
        "amount": 1,
        "unit": "packet",
        "category": "pantry",
        "price": 1.25
      },
      {
        "name": "Cornbread mix",
        "amount": 1,
        "unit": "box",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Egg",
        "amount": 1,
        "unit": "count",
        "category": "protein",
        "price": 0.4
      }
    ],
    "instructions": "1. Brown ground beef in a large pot and drain excess grease.\n2. Stir in beans, crushed tomatoes, chili seasoning, and a little water.\n3. Simmer 20 minutes, stirring occasionally.\n4. Prepare cornbread mix with egg and bake according to the box directions.\n5. Serve bowls of chili with warm cornbread."
  },
  {
    "name": "Chicken Stir Fry with Rice",
    "emoji": "\ud83c\udf5a",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Rice",
        "amount": 1.5,
        "unit": "cups",
        "category": "grains",
        "price": 1.5
      },
      {
        "name": "Frozen stir fry vegetables",
        "amount": 3,
        "unit": "cups",
        "category": "produce",
        "price": 3.0
      },
      {
        "name": "Soy sauce",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      },
      {
        "name": "Garlic",
        "amount": 2,
        "unit": "cloves",
        "category": "produce",
        "price": 0.2
      },
      {
        "name": "Vegetable oil",
        "amount": 2,
        "unit": "tbsp",
        "category": "pantry",
        "price": 0.3
      }
    ],
    "instructions": "1. Cook rice according to package directions.\n2. Cut chicken into thin strips and cook in oil until browned.\n3. Add frozen vegetables and cook until hot and crisp-tender.\n4. Stir in garlic and soy sauce, then cook one more minute.\n5. Serve the stir fry over rice."
  },
  {
    "name": "Pizza Night",
    "emoji": "\ud83c\udf55",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Pizza crust",
        "amount": 2,
        "unit": "count",
        "category": "grains",
        "price": 4.0
      },
      {
        "name": "Pizza sauce",
        "amount": 1,
        "unit": "cup",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Mozzarella cheese",
        "amount": 2,
        "unit": "cups",
        "category": "dairy",
        "price": 3.5
      },
      {
        "name": "Pepperoni",
        "amount": 4,
        "unit": "oz",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      }
    ],
    "instructions": "1. Heat oven according to the pizza crust package directions.\n2. Spread sauce over each crust.\n3. Top with mozzarella, pepperoni, and sliced bell pepper.\n4. Bake until the cheese is melted and the crust is crisp.\n5. Let cool a few minutes before slicing."
  },
  {
    "name": "Chicken Noodle Soup",
    "emoji": "\ud83c\udf72",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Chicken broth",
        "amount": 6,
        "unit": "cups",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Egg noodles",
        "amount": 2,
        "unit": "cups",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Carrots",
        "amount": 3,
        "unit": "count",
        "category": "produce",
        "price": 1.5
      },
      {
        "name": "Celery",
        "amount": 3,
        "unit": "stalks",
        "category": "produce",
        "price": 1.5
      },
      {
        "name": "Onion",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 0.8
      }
    ],
    "instructions": "1. Dice carrots, celery, and onion and cook them in a soup pot until slightly softened.\n2. Add chicken breast and broth, then simmer until the chicken is cooked through.\n3. Remove chicken, shred it, and return it to the pot.\n4. Stir in egg noodles and simmer until tender.\n5. Season with salt and pepper before serving."
  },
  {
    "name": "Baked Ziti",
    "emoji": "\ud83c\udf5d",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ziti pasta",
        "amount": 1,
        "unit": "lb",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Ground beef",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.5
      },
      {
        "name": "Marinara sauce",
        "amount": 1,
        "unit": "jar",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Ricotta cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Mozzarella cheese",
        "amount": 2,
        "unit": "cups",
        "category": "dairy",
        "price": 3.5
      }
    ],
    "instructions": "1. Cook ziti until just shy of tender and drain.\n2. Brown ground beef and stir in marinara sauce.\n3. Mix pasta with meat sauce and spoon half into a baking dish.\n4. Add dollops of ricotta, top with remaining pasta, and cover with mozzarella.\n5. Bake at 375\u00b0F until bubbling and browned on top."
  },
  {
    "name": "Chicken Fajitas",
    "emoji": "\ud83c\udf2f",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1.5,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Bell peppers",
        "amount": 3,
        "unit": "count",
        "category": "produce",
        "price": 3.0
      },
      {
        "name": "Onion",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 0.8
      },
      {
        "name": "Fajita seasoning",
        "amount": 1,
        "unit": "packet",
        "category": "pantry",
        "price": 1.25
      },
      {
        "name": "Tortillas",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Sour cream",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 1.0
      }
    ],
    "instructions": "1. Slice chicken, bell peppers, and onion into thin strips.\n2. Cook chicken in a hot skillet with fajita seasoning until browned.\n3. Add peppers and onion and cook until tender-crisp.\n4. Warm tortillas in a dry pan or microwave.\n5. Fill tortillas with chicken and vegetables and serve with sour cream."
  },
  {
    "name": "Tuna Casserole",
    "emoji": "\ud83e\udd58",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Egg noodles",
        "amount": 3,
        "unit": "cups",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Canned tuna",
        "amount": 2,
        "unit": "cans",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Cream of mushroom soup",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 1.75
      },
      {
        "name": "Frozen peas",
        "amount": 1.5,
        "unit": "cups",
        "category": "produce",
        "price": 1.5
      },
      {
        "name": "Cheddar cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Crushed crackers",
        "amount": 1,
        "unit": "cup",
        "category": "grains",
        "price": 1.0
      }
    ],
    "instructions": "1. Cook egg noodles until tender and drain.\n2. Stir noodles with tuna, soup, peas, and cheddar.\n3. Spread into a baking dish and top with crushed crackers.\n4. Bake at 375\u00b0F until hot and bubbling.\n5. Let stand 5 minutes before serving."
  },
  {
    "name": "Baked Potato Bar",
    "emoji": "\ud83e\udd54",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Russet potatoes",
        "amount": 4,
        "unit": "count",
        "category": "produce",
        "price": 3.0
      },
      {
        "name": "Shredded cheddar",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Bacon bits",
        "amount": 0.5,
        "unit": "cup",
        "category": "protein",
        "price": 2.0
      },
      {
        "name": "Sour cream",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Green onions",
        "amount": 0.5,
        "unit": "cup",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Butter",
        "amount": 4,
        "unit": "tbsp",
        "category": "dairy",
        "price": 1.0
      }
    ],
    "instructions": "1. Scrub potatoes, poke with a fork, and bake at 425\u00b0F until tender.\n2. Warm bacon bits if desired and chop green onions.\n3. Set out cheddar, sour cream, butter, bacon, and green onions.\n4. Split each potato and fluff the inside with a fork.\n5. Let everyone build their own loaded potato."
  },
  {
    "name": "Turkey Chili",
    "emoji": "\ud83c\udf36\ufe0f",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ground turkey",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.5
      },
      {
        "name": "Black beans",
        "amount": 2,
        "unit": "cans",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Diced tomatoes",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Tomato sauce",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 1.25
      },
      {
        "name": "Chili powder",
        "amount": 2,
        "unit": "tbsp",
        "category": "pantry",
        "price": 0.5
      },
      {
        "name": "Onion",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 0.8
      }
    ],
    "instructions": "1. Cook ground turkey and diced onion in a pot until the turkey is no longer pink.\n2. Stir in black beans, diced tomatoes, tomato sauce, chili powder, salt, and pepper.\n3. Simmer 20 to 30 minutes so the flavors come together.\n4. Add a splash of water if the chili gets too thick.\n5. Serve with cheese, crackers, or cornbread."
  },
  {
    "name": "Chicken Enchiladas",
    "emoji": "\ud83c\udf2f",
    "mealType": "dinner",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Cooked shredded chicken",
        "amount": 2,
        "unit": "cups",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Tortillas",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Enchilada sauce",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 2.5
      },
      {
        "name": "Shredded cheese",
        "amount": 2,
        "unit": "cups",
        "category": "dairy",
        "price": 3.5
      },
      {
        "name": "Black beans",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Sour cream",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 1.0
      }
    ],
    "instructions": "1. Heat oven to 375\u00b0F and spread a little enchilada sauce in a baking dish.\n2. Fill tortillas with shredded chicken, beans, and some cheese.\n3. Roll tortillas and place them seam-side down in the dish.\n4. Pour remaining sauce over the top and sprinkle with cheese.\n5. Bake until bubbly and serve with sour cream."
  },
  {
    "name": "Turkey Club Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 12,
        "unit": "slices",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Deli turkey",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Bacon",
        "amount": 8,
        "unit": "slices",
        "category": "protein",
        "price": 4.0
      },
      {
        "name": "Lettuce",
        "amount": 6,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Tomato",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Mayonnaise",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      }
    ],
    "instructions": "1. Cook bacon until crisp and drain on paper towels.\n2. Toast bread slices if desired.\n3. Spread mayonnaise on the bread and layer turkey, bacon, lettuce, and tomato.\n4. Stack into club sandwiches and secure with toothpicks if needed.\n5. Cut into halves or quarters and serve."
  },
  {
    "name": "Tuna Melts",
    "emoji": "\ud83e\udd6a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Canned tuna",
        "amount": 2,
        "unit": "cans",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Cheddar cheese slices",
        "amount": 4,
        "unit": "count",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Mayonnaise",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      },
      {
        "name": "Celery",
        "amount": 1,
        "unit": "stalk",
        "category": "produce",
        "price": 0.5
      },
      {
        "name": "Butter",
        "amount": 2,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.5
      }
    ],
    "instructions": "1. Mix drained tuna with mayonnaise and finely chopped celery.\n2. Spoon tuna salad onto bread and top with cheddar slices.\n3. Butter the outside of each sandwich.\n4. Cook in a skillet until the bread is golden and the cheese melts.\n5. Let cool briefly before cutting."
  },
  {
    "name": "Ham and Cheese Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Deli ham",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Cheese slices",
        "amount": 4,
        "unit": "count",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Lettuce",
        "amount": 4,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Mustard",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.5
      }
    ],
    "instructions": "1. Lay out bread slices and spread mustard on one side.\n2. Layer ham, cheese, and lettuce on four slices.\n3. Top with remaining bread and press gently.\n4. Slice sandwiches in half.\n5. Serve with fruit, chips, or raw vegetables."
  },
  {
    "name": "Chicken Caesar Wraps",
    "emoji": "\ud83c\udf2f",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Cooked chicken",
        "amount": 2,
        "unit": "cups",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Tortillas",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Romaine lettuce",
        "amount": 1,
        "unit": "head",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Caesar dressing",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Parmesan cheese",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Croutons",
        "amount": 1,
        "unit": "cup",
        "category": "grains",
        "price": 1.0
      }
    ],
    "instructions": "1. Chop romaine and slice cooked chicken.\n2. Toss romaine with Caesar dressing, Parmesan, and crushed croutons.\n3. Lay tortillas flat and add chicken and salad mixture.\n4. Fold in the sides and roll tightly.\n5. Cut wraps in half and serve cold or lightly warmed."
  },
  {
    "name": "Peanut Butter and Jelly Sandwiches",
    "emoji": "\ud83e\udd5c",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Peanut butter",
        "amount": 0.75,
        "unit": "cup",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Jelly",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Bananas",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Baby carrots",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 2.0
      }
    ],
    "instructions": "1. Spread peanut butter on half of the bread slices.\n2. Spread jelly on the remaining slices.\n3. Press sandwiches together and cut in halves.\n4. Slice bananas and portion baby carrots on the side.\n5. Pack or serve immediately."
  },
  {
    "name": "Grilled Chicken Salad",
    "emoji": "\ud83e\udd57",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Romaine lettuce",
        "amount": 1,
        "unit": "head",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Cucumber",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Cherry tomatoes",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Shredded cheese",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 1.5
      },
      {
        "name": "Ranch dressing",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.5
      }
    ],
    "instructions": "1. Season chicken and cook in a skillet or grill pan until done.\n2. Rest chicken for 5 minutes, then slice.\n3. Chop lettuce, cucumber, and tomatoes.\n4. Divide vegetables into bowls and top with chicken and cheese.\n5. Drizzle with ranch dressing."
  },
  {
    "name": "Turkey and Cheese Wraps",
    "emoji": "\ud83c\udf2f",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Tortillas",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Deli turkey",
        "amount": 0.75,
        "unit": "lb",
        "category": "protein",
        "price": 5.0
      },
      {
        "name": "Cheese slices",
        "amount": 4,
        "unit": "count",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Lettuce",
        "amount": 4,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Ranch dressing",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      }
    ],
    "instructions": "1. Lay tortillas on a clean surface.\n2. Spread a thin layer of ranch over each tortilla.\n3. Add turkey, cheese, and lettuce.\n4. Roll tightly and tuck in the sides.\n5. Slice each wrap in half."
  },
  {
    "name": "BLT Sandwiches",
    "emoji": "\ud83e\udd53",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Bacon",
        "amount": 12,
        "unit": "slices",
        "category": "protein",
        "price": 5.0
      },
      {
        "name": "Lettuce",
        "amount": 6,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Tomato",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Mayonnaise",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      }
    ],
    "instructions": "1. Cook bacon until crisp and drain.\n2. Toast bread slices if desired.\n3. Spread mayonnaise on bread.\n4. Layer bacon, lettuce, and tomato slices.\n5. Close sandwiches and serve right away."
  },
  {
    "name": "Chicken Salad Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Cooked chicken",
        "amount": 2,
        "unit": "cups",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Mayonnaise",
        "amount": 0.33,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      },
      {
        "name": "Celery",
        "amount": 2,
        "unit": "stalks",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Grapes",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Lettuce",
        "amount": 4,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      }
    ],
    "instructions": "1. Chop cooked chicken into small pieces.\n2. Stir chicken with mayonnaise, diced celery, halved grapes, salt, and pepper.\n3. Place lettuce on bread slices.\n4. Spoon chicken salad onto the sandwiches.\n5. Close, cut, and serve chilled."
  },
  {
    "name": "Egg Salad Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Eggs",
        "amount": 8,
        "unit": "count",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Mayonnaise",
        "amount": 0.33,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      },
      {
        "name": "Mustard",
        "amount": 1,
        "unit": "tbsp",
        "category": "pantry",
        "price": 0.2
      },
      {
        "name": "Celery",
        "amount": 1,
        "unit": "stalk",
        "category": "produce",
        "price": 0.5
      },
      {
        "name": "Lettuce",
        "amount": 4,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      }
    ],
    "instructions": "1. Hard-boil eggs, cool them, and peel.\n2. Chop eggs and mix with mayonnaise, mustard, diced celery, salt, and pepper.\n3. Place lettuce on bread slices.\n4. Add egg salad and top with remaining bread.\n5. Cut sandwiches and serve."
  },
  {
    "name": "Bean and Cheese Burritos",
    "emoji": "\ud83c\udf2f",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Flour tortillas",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Refried beans",
        "amount": 2,
        "unit": "cups",
        "category": "pantry",
        "price": 2.5
      },
      {
        "name": "Shredded cheese",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Salsa",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      },
      {
        "name": "Sour cream",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 1.0
      }
    ],
    "instructions": "1. Warm refried beans in a small saucepan.\n2. Warm tortillas so they fold without tearing.\n3. Spoon beans and cheese into each tortilla.\n4. Roll into burritos and heat in a skillet until the outside is lightly browned.\n5. Serve with salsa and sour cream."
  },
  {
    "name": "Ham and Swiss Sliders",
    "emoji": "\ud83c\udf54",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Slider rolls",
        "amount": 12,
        "unit": "count",
        "category": "grains",
        "price": 4.0
      },
      {
        "name": "Deli ham",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Swiss cheese",
        "amount": 8,
        "unit": "slices",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Butter",
        "amount": 3,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.75
      },
      {
        "name": "Mustard",
        "amount": 2,
        "unit": "tbsp",
        "category": "pantry",
        "price": 0.3
      }
    ],
    "instructions": "1. Heat oven to 350\u00b0F and slice slider rolls as a sheet.\n2. Layer ham and Swiss cheese on the bottom rolls.\n3. Replace the tops and brush with melted butter mixed with mustard.\n4. Bake until the cheese melts and rolls are warm.\n5. Cut into individual sliders."
  },
  {
    "name": "Taco Salad Bowls",
    "emoji": "\ud83e\udd57",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.5
      },
      {
        "name": "Romaine lettuce",
        "amount": 1,
        "unit": "head",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Taco seasoning",
        "amount": 1,
        "unit": "packet",
        "category": "pantry",
        "price": 1.25
      },
      {
        "name": "Tortilla chips",
        "amount": 3,
        "unit": "cups",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Shredded cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Salsa",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      }
    ],
    "instructions": "1. Brown ground beef and season it with taco seasoning.\n2. Chop romaine and divide it into bowls.\n3. Top lettuce with taco beef, cheese, salsa, and crushed tortilla chips.\n4. Add sour cream or avocado if desired.\n5. Serve while the beef is still warm."
  },
  {
    "name": "Chicken Ranch Wraps",
    "emoji": "\ud83c\udf2f",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Cooked chicken",
        "amount": 2,
        "unit": "cups",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Tortillas",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Ranch dressing",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Shredded lettuce",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 1.5
      },
      {
        "name": "Cheddar cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Tomato",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      }
    ],
    "instructions": "1. Dice cooked chicken and tomato.\n2. Spread ranch dressing on each tortilla.\n3. Add chicken, lettuce, cheddar, and tomato.\n4. Roll tightly, tucking in the sides.\n5. Slice and serve with fruit or chips."
  },
  {
    "name": "Meatball Subs",
    "emoji": "\ud83e\udd56",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Frozen meatballs",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Sub rolls",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Marinara sauce",
        "amount": 1,
        "unit": "jar",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Mozzarella cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.5
      },
      {
        "name": "Parmesan cheese",
        "amount": 0.25,
        "unit": "cup",
        "category": "dairy",
        "price": 1.0
      }
    ],
    "instructions": "1. Simmer meatballs in marinara sauce until hot.\n2. Split sub rolls and place them on a baking sheet.\n3. Fill rolls with saucy meatballs.\n4. Top with mozzarella and Parmesan.\n5. Broil briefly until the cheese melts."
  },
  {
    "name": "Pasta Salad with Chicken",
    "emoji": "\ud83e\udd57",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Rotini pasta",
        "amount": 1,
        "unit": "lb",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Cooked chicken",
        "amount": 2,
        "unit": "cups",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Italian dressing",
        "amount": 0.75,
        "unit": "cup",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Cherry tomatoes",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Cucumber",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Mozzarella cubes",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 3.0
      }
    ],
    "instructions": "1. Cook rotini, drain, and rinse under cool water.\n2. Dice cooked chicken, cucumber, and tomatoes.\n3. Toss pasta with chicken, vegetables, mozzarella, and Italian dressing.\n4. Chill for at least 20 minutes if time allows.\n5. Stir again before serving."
  },
  {
    "name": "Turkey Avocado Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Deli turkey",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 7.0
      },
      {
        "name": "Avocado",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 3.0
      },
      {
        "name": "Lettuce",
        "amount": 4,
        "unit": "leaves",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Tomato",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Mayonnaise",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.75
      }
    ],
    "instructions": "1. Mash avocado with a pinch of salt.\n2. Spread mayonnaise on bread and avocado on the other side.\n3. Layer turkey, lettuce, and tomato.\n4. Close sandwiches and press gently.\n5. Cut in half and serve right away."
  },
  {
    "name": "BBQ Chicken Flatbreads",
    "emoji": "\ud83c\udf55",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Flatbreads",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 4.0
      },
      {
        "name": "Cooked chicken",
        "amount": 2,
        "unit": "cups",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "BBQ sauce",
        "amount": 0.75,
        "unit": "cup",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Mozzarella cheese",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Red onion",
        "amount": 0.5,
        "unit": "count",
        "category": "produce",
        "price": 0.5
      }
    ],
    "instructions": "1. Heat oven to 400\u00b0F.\n2. Spread BBQ sauce over each flatbread.\n3. Top with chicken, mozzarella, and thinly sliced red onion.\n4. Bake until the cheese melts and edges are crisp.\n5. Slice into wedges."
  },
  {
    "name": "Chicken Rice Bowls",
    "emoji": "\ud83c\udf5a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Cooked chicken",
        "amount": 2,
        "unit": "cups",
        "category": "protein",
        "price": 6.0
      },
      {
        "name": "Rice",
        "amount": 1.5,
        "unit": "cups",
        "category": "grains",
        "price": 1.5
      },
      {
        "name": "Black beans",
        "amount": 1,
        "unit": "can",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Corn",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Salsa",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      },
      {
        "name": "Shredded cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      }
    ],
    "instructions": "1. Cook rice and warm black beans and corn.\n2. Warm cooked chicken in a skillet or microwave.\n3. Divide rice among bowls.\n4. Top with chicken, beans, corn, salsa, and cheese.\n5. Serve warm."
  },
  {
    "name": "Veggie Hummus Wraps",
    "emoji": "\ud83c\udf2f",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Tortillas",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Hummus",
        "amount": 1,
        "unit": "cup",
        "category": "pantry",
        "price": 3.0
      },
      {
        "name": "Cucumber",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Carrots",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Spinach",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 2.0
      }
    ],
    "instructions": "1. Slice cucumber, bell pepper, and carrots into thin strips.\n2. Spread hummus over each tortilla.\n3. Add spinach and sliced vegetables.\n4. Roll tightly and cut in half.\n5. Serve chilled or at room temperature."
  },
  {
    "name": "Grilled Cheese Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "lunch",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Cheddar cheese slices",
        "amount": 8,
        "unit": "count",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Butter",
        "amount": 4,
        "unit": "tbsp",
        "category": "dairy",
        "price": 1.0
      },
      {
        "name": "Apple slices",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 2.0
      }
    ],
    "instructions": "1. Butter one side of each bread slice.\n2. Place cheese between bread with the buttered sides facing out.\n3. Cook in a skillet over medium heat until golden on the first side.\n4. Flip and cook until the second side is golden and cheese melts.\n5. Serve with apple slices."
  },
  {
    "name": "Pancakes and Eggs",
    "emoji": "\ud83e\udd5e",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Pancake mix",
        "amount": 2,
        "unit": "cups",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Eggs",
        "amount": 6,
        "unit": "count",
        "category": "protein",
        "price": 2.5
      },
      {
        "name": "Milk",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 1.0
      },
      {
        "name": "Syrup",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.5
      },
      {
        "name": "Butter",
        "amount": 2,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.5
      }
    ],
    "instructions": "1. Prepare pancake batter with pancake mix, milk, and eggs according to the package directions.\n2. Cook pancakes on a greased griddle until bubbles form, then flip and finish.\n3. Scramble or fry the remaining eggs.\n4. Keep pancakes warm while the eggs finish.\n5. Serve with butter and syrup."
  },
  {
    "name": "Scrambled Eggs and Toast",
    "emoji": "\ud83c\udf73",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Eggs",
        "amount": 8,
        "unit": "count",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Milk",
        "amount": 0.25,
        "unit": "cup",
        "category": "dairy",
        "price": 0.2
      },
      {
        "name": "Butter",
        "amount": 2,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.5
      },
      {
        "name": "Cheddar cheese",
        "amount": 0.5,
        "unit": "cup",
        "category": "dairy",
        "price": 1.5
      }
    ],
    "instructions": "1. Whisk eggs with milk, salt, and pepper.\n2. Melt butter in a skillet over low to medium heat.\n3. Add eggs and stir gently until soft curds form.\n4. Sprinkle in cheddar and let it melt.\n5. Serve with buttered toast."
  },
  {
    "name": "Bacon Egg and Cheese Biscuits",
    "emoji": "\ud83e\udd6f",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Biscuits",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Eggs",
        "amount": 6,
        "unit": "count",
        "category": "protein",
        "price": 2.5
      },
      {
        "name": "Bacon",
        "amount": 8,
        "unit": "slices",
        "category": "protein",
        "price": 4.0
      },
      {
        "name": "Cheese slices",
        "amount": 4,
        "unit": "count",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Butter",
        "amount": 1,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.25
      }
    ],
    "instructions": "1. Bake biscuits according to package directions.\n2. Cook bacon until crisp and drain.\n3. Scramble or fry eggs in a buttered skillet.\n4. Split biscuits and layer eggs, bacon, and cheese.\n5. Serve warm."
  },
  {
    "name": "Sausage Breakfast Burritos",
    "emoji": "\ud83c\udf2f",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Breakfast sausage",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.0
      },
      {
        "name": "Eggs",
        "amount": 8,
        "unit": "count",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Tortillas",
        "amount": 6,
        "unit": "count",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Shredded cheddar",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Frozen hash browns",
        "amount": 2,
        "unit": "cups",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Salsa",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      }
    ],
    "instructions": "1. Brown breakfast sausage in a skillet.\n2. Cook hash browns until crisp.\n3. Scramble eggs in the same pan or a separate skillet.\n4. Fill tortillas with sausage, eggs, hash browns, cheese, and salsa.\n5. Roll into burritos and warm seam-side down."
  },
  {
    "name": "French Toast and Bacon",
    "emoji": "\ud83c\udf5e",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Eggs",
        "amount": 4,
        "unit": "count",
        "category": "protein",
        "price": 1.5
      },
      {
        "name": "Milk",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 0.75
      },
      {
        "name": "Cinnamon",
        "amount": 1,
        "unit": "tsp",
        "category": "pantry",
        "price": 0.1
      },
      {
        "name": "Bacon",
        "amount": 8,
        "unit": "slices",
        "category": "protein",
        "price": 4.0
      },
      {
        "name": "Syrup",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.5
      }
    ],
    "instructions": "1. Cook bacon until crisp and keep warm.\n2. Whisk eggs, milk, cinnamon, and a pinch of salt in a shallow dish.\n3. Dip bread slices in the egg mixture.\n4. Cook on a buttered griddle until browned on both sides.\n5. Serve with bacon and syrup."
  },
  {
    "name": "Waffles and Sausage",
    "emoji": "\ud83e\uddc7",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Waffle mix",
        "amount": 2,
        "unit": "cups",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Eggs",
        "amount": 2,
        "unit": "count",
        "category": "protein",
        "price": 0.8
      },
      {
        "name": "Milk",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 1.0
      },
      {
        "name": "Breakfast sausage links",
        "amount": 12,
        "unit": "count",
        "category": "protein",
        "price": 5.0
      },
      {
        "name": "Syrup",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.5
      }
    ],
    "instructions": "1. Prepare waffle batter with mix, eggs, and milk.\n2. Cook waffles in a heated waffle iron until crisp.\n3. Brown sausage links in a skillet until cooked through.\n4. Keep waffles warm while the remaining batter cooks.\n5. Serve with sausage and syrup."
  },
  {
    "name": "Oatmeal with Bananas",
    "emoji": "\ud83e\udd63",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Old-fashioned oats",
        "amount": 2,
        "unit": "cups",
        "category": "grains",
        "price": 1.5
      },
      {
        "name": "Milk",
        "amount": 3,
        "unit": "cups",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Bananas",
        "amount": 3,
        "unit": "count",
        "category": "produce",
        "price": 1.5
      },
      {
        "name": "Brown sugar",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.5
      },
      {
        "name": "Cinnamon",
        "amount": 1,
        "unit": "tsp",
        "category": "pantry",
        "price": 0.1
      }
    ],
    "instructions": "1. Bring milk to a gentle simmer in a saucepan.\n2. Stir in oats and cook until thickened.\n3. Slice bananas while the oatmeal cooks.\n4. Stir in cinnamon and brown sugar.\n5. Top bowls with banana slices."
  },
  {
    "name": "Yogurt Parfaits",
    "emoji": "\ud83c\udf53",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Greek yogurt",
        "amount": 4,
        "unit": "cups",
        "category": "dairy",
        "price": 5.0
      },
      {
        "name": "Granola",
        "amount": 2,
        "unit": "cups",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Strawberries",
        "amount": 2,
        "unit": "cups",
        "category": "produce",
        "price": 4.0
      },
      {
        "name": "Blueberries",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 3.0
      },
      {
        "name": "Honey",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      }
    ],
    "instructions": "1. Wash berries and slice strawberries.\n2. Spoon yogurt into bowls or cups.\n3. Add layers of granola and berries.\n4. Drizzle with honey.\n5. Serve immediately so the granola stays crunchy."
  },
  {
    "name": "Breakfast Sandwiches",
    "emoji": "\ud83e\udd6a",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "English muffins",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Eggs",
        "amount": 4,
        "unit": "count",
        "category": "protein",
        "price": 1.5
      },
      {
        "name": "Cheese slices",
        "amount": 4,
        "unit": "count",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Canadian bacon",
        "amount": 4,
        "unit": "slices",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Butter",
        "amount": 1,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.25
      }
    ],
    "instructions": "1. Toast English muffins.\n2. Cook eggs in a buttered skillet, shaping them to fit the muffins.\n3. Warm Canadian bacon in the skillet.\n4. Stack egg, cheese, and Canadian bacon on each muffin.\n5. Serve warm or wrap for later."
  },
  {
    "name": "Biscuits and Gravy",
    "emoji": "\ud83c\udf7d\ufe0f",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Biscuits",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Breakfast sausage",
        "amount": 1,
        "unit": "lb",
        "category": "protein",
        "price": 5.0
      },
      {
        "name": "Flour",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.2
      },
      {
        "name": "Milk",
        "amount": 3,
        "unit": "cups",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Black pepper",
        "amount": 1,
        "unit": "tsp",
        "category": "pantry",
        "price": 0.1
      }
    ],
    "instructions": "1. Bake biscuits according to package directions.\n2. Brown sausage in a skillet and leave the drippings in the pan.\n3. Sprinkle flour over the sausage and stir for one minute.\n4. Slowly add milk while stirring until the gravy thickens.\n5. Split biscuits and spoon gravy over the top."
  },
  {
    "name": "Hash Browns and Eggs",
    "emoji": "\ud83e\udd54",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Frozen hash browns",
        "amount": 4,
        "unit": "cups",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Eggs",
        "amount": 8,
        "unit": "count",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Cheddar cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Green onions",
        "amount": 0.25,
        "unit": "cup",
        "category": "produce",
        "price": 0.75
      },
      {
        "name": "Butter",
        "amount": 2,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.5
      }
    ],
    "instructions": "1. Cook hash browns in butter until crisp and browned.\n2. Season with salt and pepper.\n3. Cook eggs to your preference in a separate skillet.\n4. Sprinkle cheese over the hot hash browns.\n5. Top with eggs and green onions."
  },
  {
    "name": "Breakfast Tacos",
    "emoji": "\ud83c\udf2e",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Eggs",
        "amount": 8,
        "unit": "count",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Tortillas",
        "amount": 8,
        "unit": "count",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Breakfast sausage",
        "amount": 0.75,
        "unit": "lb",
        "category": "protein",
        "price": 4.0
      },
      {
        "name": "Shredded cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Salsa",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      }
    ],
    "instructions": "1. Brown breakfast sausage in a skillet.\n2. Scramble eggs until just set.\n3. Warm tortillas.\n4. Fill tortillas with eggs, sausage, cheese, and salsa.\n5. Fold and serve warm."
  },
  {
    "name": "Cereal and Fruit",
    "emoji": "\ud83e\udd63",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Cereal",
        "amount": 4,
        "unit": "cups",
        "category": "grains",
        "price": 3.0
      },
      {
        "name": "Milk",
        "amount": 4,
        "unit": "cups",
        "category": "dairy",
        "price": 2.5
      },
      {
        "name": "Bananas",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Strawberries",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Yogurt",
        "amount": 2,
        "unit": "cups",
        "category": "dairy",
        "price": 2.5
      }
    ],
    "instructions": "1. Slice bananas and strawberries.\n2. Pour cereal into bowls.\n3. Add milk to each bowl.\n4. Serve fruit and yogurt on the side.\n5. Add fruit directly to cereal if desired."
  },
  {
    "name": "Bagels with Cream Cheese",
    "emoji": "\ud83e\udd6f",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bagels",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 3.5
      },
      {
        "name": "Cream cheese",
        "amount": 8,
        "unit": "oz",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Strawberries",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Orange juice",
        "amount": 4,
        "unit": "cups",
        "category": "other",
        "price": 3.0
      }
    ],
    "instructions": "1. Slice bagels in half.\n2. Toast bagels until lightly crisp.\n3. Spread cream cheese on each half.\n4. Wash and slice strawberries.\n5. Serve bagels with fruit and orange juice."
  },
  {
    "name": "Peanut Butter Banana Toast",
    "emoji": "\ud83c\udf4c",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 8,
        "unit": "slices",
        "category": "grains",
        "price": 2.5
      },
      {
        "name": "Peanut butter",
        "amount": 0.75,
        "unit": "cup",
        "category": "pantry",
        "price": 2.0
      },
      {
        "name": "Bananas",
        "amount": 4,
        "unit": "count",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Honey",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      },
      {
        "name": "Cinnamon",
        "amount": 1,
        "unit": "tsp",
        "category": "pantry",
        "price": 0.1
      }
    ],
    "instructions": "1. Toast bread slices.\n2. Spread peanut butter over each piece of toast.\n3. Slice bananas and arrange them on top.\n4. Drizzle lightly with honey.\n5. Finish with a pinch of cinnamon."
  },
  {
    "name": "Egg Muffin Cups",
    "emoji": "\ud83c\udf73",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Eggs",
        "amount": 10,
        "unit": "count",
        "category": "protein",
        "price": 4.0
      },
      {
        "name": "Diced ham",
        "amount": 1,
        "unit": "cup",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Shredded cheese",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Spinach",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 1.0
      }
    ],
    "instructions": "1. Heat oven to 350\u00b0F and grease a muffin tin.\n2. Whisk eggs with salt and pepper.\n3. Divide ham, cheese, bell pepper, and spinach among muffin cups.\n4. Pour eggs over the fillings.\n5. Bake until the egg cups are set."
  },
  {
    "name": "Breakfast Quesadillas",
    "emoji": "\ud83c\udf2e",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Tortillas",
        "amount": 4,
        "unit": "count",
        "category": "grains",
        "price": 2.0
      },
      {
        "name": "Eggs",
        "amount": 6,
        "unit": "count",
        "category": "protein",
        "price": 2.5
      },
      {
        "name": "Shredded cheese",
        "amount": 1.5,
        "unit": "cups",
        "category": "dairy",
        "price": 3.0
      },
      {
        "name": "Breakfast sausage",
        "amount": 0.5,
        "unit": "lb",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Salsa",
        "amount": 0.5,
        "unit": "cup",
        "category": "pantry",
        "price": 1.0
      }
    ],
    "instructions": "1. Brown breakfast sausage and set aside.\n2. Scramble eggs until just set.\n3. Place tortillas in a skillet and fill with eggs, sausage, and cheese.\n4. Fold and cook until both sides are crisp and cheese melts.\n5. Cut into wedges and serve with salsa."
  },
  {
    "name": "Apple Cinnamon Oatmeal",
    "emoji": "\ud83c\udf4e",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Old-fashioned oats",
        "amount": 2,
        "unit": "cups",
        "category": "grains",
        "price": 1.5
      },
      {
        "name": "Milk",
        "amount": 3,
        "unit": "cups",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Apples",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 2.0
      },
      {
        "name": "Brown sugar",
        "amount": 0.25,
        "unit": "cup",
        "category": "pantry",
        "price": 0.5
      },
      {
        "name": "Cinnamon",
        "amount": 1.5,
        "unit": "tsp",
        "category": "pantry",
        "price": 0.15
      }
    ],
    "instructions": "1. Dice apples into small pieces.\n2. Simmer oats and milk in a saucepan.\n3. Stir in apples, brown sugar, and cinnamon.\n4. Cook until oats are creamy and apples soften.\n5. Serve warm with extra cinnamon if desired."
  },
  {
    "name": "Ham and Cheese Omelets",
    "emoji": "\ud83c\udf73",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Eggs",
        "amount": 8,
        "unit": "count",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Diced ham",
        "amount": 1,
        "unit": "cup",
        "category": "protein",
        "price": 3.0
      },
      {
        "name": "Shredded cheddar",
        "amount": 1,
        "unit": "cup",
        "category": "dairy",
        "price": 2.0
      },
      {
        "name": "Milk",
        "amount": 0.25,
        "unit": "cup",
        "category": "dairy",
        "price": 0.2
      },
      {
        "name": "Butter",
        "amount": 2,
        "unit": "tbsp",
        "category": "dairy",
        "price": 0.5
      }
    ],
    "instructions": "1. Whisk eggs with milk, salt, and pepper.\n2. Melt butter in a nonstick skillet.\n3. Pour in eggs and cook until mostly set.\n4. Add ham and cheddar to one side, then fold the omelet.\n5. Cook one more minute so the cheese melts."
  },
  {
    "name": "Avocado Toast and Eggs",
    "emoji": "\ud83e\udd51",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Bread",
        "amount": 4,
        "unit": "slices",
        "category": "grains",
        "price": 1.5
      },
      {
        "name": "Avocado",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 3.0
      },
      {
        "name": "Eggs",
        "amount": 4,
        "unit": "count",
        "category": "protein",
        "price": 1.5
      },
      {
        "name": "Lemon juice",
        "amount": 1,
        "unit": "tbsp",
        "category": "produce",
        "price": 0.3
      },
      {
        "name": "Everything seasoning",
        "amount": 1,
        "unit": "tbsp",
        "category": "pantry",
        "price": 0.5
      }
    ],
    "instructions": "1. Toast bread until crisp.\n2. Mash avocado with lemon juice, salt, and pepper.\n3. Fry or scramble eggs.\n4. Spread avocado on toast and top with eggs.\n5. Sprinkle with everything seasoning."
  },
  {
    "name": "Granola and Milk Bowls",
    "emoji": "\ud83e\udd63",
    "mealType": "breakfast",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "Granola",
        "amount": 3,
        "unit": "cups",
        "category": "grains",
        "price": 4.0
      },
      {
        "name": "Milk",
        "amount": 4,
        "unit": "cups",
        "category": "dairy",
        "price": 2.5
      },
      {
        "name": "Blueberries",
        "amount": 1,
        "unit": "cup",
        "category": "produce",
        "price": 3.0
      },
      {
        "name": "Bananas",
        "amount": 2,
        "unit": "count",
        "category": "produce",
        "price": 1.0
      },
      {
        "name": "Yogurt",
        "amount": 2,
        "unit": "cups",
        "category": "dairy",
        "price": 2.5
      }
    ],
    "instructions": "1. Divide granola into bowls.\n2. Add milk or yogurt, depending on preference.\n3. Slice bananas and rinse blueberries.\n4. Top each bowl with fruit.\n5. Serve right away for the best crunch."
  }
];

export const PRELOADED_MEALS = RAW_PRELOADED_MEALS.map((meal, index) => ({
  ...meal,
  id: `preloaded-${meal.mealType}-${String(index + 1).padStart(2, "0")}-${slugify(meal.name)}`,
}));
