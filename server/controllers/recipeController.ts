import { Request, Response } from 'express';

export interface IRecipe {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  tip?: string;
}

const RECIPES_DB: IRecipe[] = [
  {
    id: 'b1',
    name: 'Protein-Packed Avocado Toast',
    category: 'Breakfast',
    calories: 320,
    protein: 14,
    carbs: 28,
    fat: 18,
    prepTime: '10 mins',
    ingredients: [
      '2 slices of whole-grain bread',
      '1/2 ripe avocado',
      '2 large eggs (boiled or poached)',
      '1 tbsp chia seeds',
      'Pinch of red pepper flakes',
      'Salt and black pepper to taste'
    ],
    instructions: [
      'Toast the whole-grain bread slices to your desired level of crispness.',
      'In a small bowl, mash the ripe avocado with salt, black pepper, and red pepper flakes.',
      'Spread the mashed avocado evenly across the toasted bread slices.',
      'Top each slice with a cooked egg (sliced, poached, or fried lightly).',
      'Sprinkle chia seeds and optional additional spices on top. Serve immediately.'
    ],
    tip: 'Add a handful of cherry tomatoes on the side for extra antioxidants!'
  },
  {
    id: 'b2',
    name: 'Berry Chia Overnight Oats',
    category: 'Breakfast',
    calories: 290,
    protein: 11,
    carbs: 45,
    fat: 7,
    prepTime: '5 mins + overnight',
    ingredients: [
      '1/2 cup rolled oats',
      '1/2 cup unsweetened almond milk',
      '1/4 cup plain Greek yogurt',
      '1 tbsp chia seeds',
      '1/2 cup mixed fresh berries',
      '1 tsp honey or maple syrup'
    ],
    instructions: [
      'In a mason jar or airtight container, combine oats, almond milk, Greek yogurt, chia seeds, and honey.',
      'Stir the mixture thoroughly until well combined.',
      'Gently fold in half of the fresh berries.',
      'Seal the container and refrigerate overnight (or for at least 4 hours).',
      'Before serving, stir once and top with the remaining fresh berries.'
    ],
    tip: 'Add a scoop of protein powder for a post-workout breakfast option!'
  },
  {
    id: 'l1',
    name: 'Mediterranean Quinoa Bowl',
    category: 'Lunch',
    calories: 450,
    protein: 15,
    carbs: 58,
    fat: 19,
    prepTime: '15 mins',
    ingredients: [
      '1 cup cooked quinoa',
      '1/2 cup chickpeas (drained and rinsed)',
      '1/2 cucumber (chopped)',
      '1/2 cup cherry tomatoes (halved)',
      '1/4 cup crumbled feta cheese',
      '5 kalamata olives (pitted)',
      '1 tbsp olive oil',
      '1 tbsp lemon juice'
    ],
    instructions: [
      'Place the cooked, cooled quinoa in a large serving bowl.',
      'Arrange chickpeas, chopped cucumber, halved cherry tomatoes, crumbled feta, and olives in neat sections on top.',
      'In a small cup, whisk together the olive oil and fresh lemon juice with a pinch of salt.',
      'Drizzle the dressing over the bowl right before eating, and toss gently to mix.'
    ],
    tip: 'Add grilled chicken breast or baked tofu for extra protein.'
  },
  {
    id: 'l2',
    name: 'Sesame Ginger Tofu & Broccoli',
    category: 'Lunch',
    calories: 380,
    protein: 18,
    carbs: 32,
    fat: 20,
    prepTime: '20 mins',
    ingredients: [
      '200g firm tofu (pressed and cubed)',
      '2 cups broccoli florets',
      '1 tbsp sesame oil',
      '1 tbsp low-sodium soy sauce',
      '1 tsp freshly grated ginger',
      '1 clove garlic (minced)',
      '1 tsp sesame seeds',
      '1/2 cup cooked brown rice'
    ],
    instructions: [
      'Heat sesame oil in a non-stick skillet over medium-high heat.',
      'Add cubed tofu and pan-fry until golden brown on all sides (about 8 minutes). Remove from skillet.',
      'In the same skillet, add minced garlic and grated ginger, sautéing for 1 minute.',
      'Add broccoli florets and 2 tablespoons of water. Cover and steam for 3-4 minutes until tender-crisp.',
      'Return tofu to the skillet, pour in the soy sauce, and toss everything together for 2 minutes.',
      'Serve over cooked brown rice, garnished with sesame seeds.'
    ]
  },
  {
    id: 'd1',
    name: 'Lemon Herb Baked Salmon',
    category: 'Dinner',
    calories: 410,
    protein: 34,
    carbs: 10,
    fat: 26,
    prepTime: '25 mins',
    ingredients: [
      '150g salmon fillet',
      '1 cup asparagus spears (trimmed)',
      '1 tbsp olive oil',
      '1/2 lemon (sliced)',
      '1 tsp dried dill or rosemary',
      '1 clove garlic (sliced)',
      'Salt and black pepper to taste'
    ],
    instructions: [
      'Preheat your oven to 400°F (200°C) and line a baking sheet with parchment paper.',
      'Place the salmon fillet and trimmed asparagus spears on the baking sheet.',
      'Drizzle both salmon and asparagus with olive oil.',
      'Season with salt, pepper, dried herbs, and garlic slices.',
      'Top the salmon fillet with fresh lemon slices.',
      'Bake for 12-15 minutes, or until the salmon flakes easily with a fork and asparagus is tender.'
    ],
    tip: 'Perfect paired with a side of roasted sweet potatoes.'
  },
  {
    id: 'd2',
    name: 'Lean Turkey & Veggie Stir-Fry',
    category: 'Dinner',
    calories: 360,
    protein: 28,
    carbs: 20,
    fat: 14,
    prepTime: '20 mins',
    ingredients: [
      '150g lean ground turkey',
      '1 cup mixed bell peppers (sliced)',
      '1/2 cup snap peas',
      '1/2 cup carrots (julienned)',
      '1 tbsp olive oil',
      '1.5 tbsp teriyaki or soy sauce',
      '1 green onion (sliced)'
    ],
    instructions: [
      'Heat olive oil in a wok or large skillet over medium-high heat.',
      'Add ground turkey and cook, breaking it apart, until fully browned (about 6 minutes).',
      'Add sliced bell peppers, snap peas, and carrots. Stir-fry for 5 minutes until vegetables are slightly tender.',
      'Pour in the sauce and toss everything to coat, heating for an additional 2 minutes.',
      'Serve hot, garnished with sliced green onions.'
    ]
  },
  {
    id: 's1',
    name: 'Greek Yogurt with Walnuts & Honey',
    category: 'Snacks',
    calories: 190,
    protein: 15,
    carbs: 12,
    fat: 9,
    prepTime: '3 mins',
    ingredients: [
      '3/4 cup unsweetened plain Greek yogurt',
      '5 walnut halves (crushed)',
      '1 tsp organic honey',
      'Pinch of cinnamon'
    ],
    instructions: [
      'Spoon Greek yogurt into a serving bowl.',
      'Top with crushed walnuts and a pinch of cinnamon.',
      'Drizzle with honey and serve cold.'
    ],
    tip: 'Greek yogurt is high in casein protein, making this an excellent evening snack!'
  },
  {
    id: 's2',
    name: 'Spiced Roasted Chickpeas',
    category: 'Snacks',
    calories: 150,
    protein: 7,
    carbs: 22,
    fat: 4,
    prepTime: '30 mins',
    ingredients: [
      '1 can (400g) chickpeas (rinsed, drained, and dried thoroughly)',
      '1 tsp olive oil',
      '1/2 tsp cumin',
      '1/2 tsp smoked paprika',
      '1/4 tsp garlic powder',
      '1/4 tsp salt'
    ],
    instructions: [
      'Preheat oven to 400°F (200°C).',
      'Toss dried chickpeas with olive oil and spices until completely coated.',
      'Spread in a single layer on a baking sheet.',
      'Roast for 20-25 minutes, shaking the pan halfway through, until crispy.',
      'Let cool slightly before serving. They will crisp up further as they cool.'
    ]
  }
];

export const getRecipes = (req: Request, res: Response): void => {
  try {
    const { category } = req.query;
    if (category) {
      const filtered = RECIPES_DB.filter(r => r.category.toLowerCase() === String(category).toLowerCase());
      res.status(200).json({ success: true, recipes: filtered });
      return;
    }
    res.status(200).json({ success: true, recipes: RECIPES_DB });
  } catch (error) {
    console.error('getRecipes Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving recipes' });
  }
};
