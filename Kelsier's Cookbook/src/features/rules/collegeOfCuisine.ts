export type CuisineFeature = {
  level: string;
  title: string;
  summary: string[];
  bullets?: string[];
  flavorNotes?: string[];
};

export const collegeOfCuisineIntro = [
  'Food fuels thought, builds bones, and delights the senses. More than that, breaking bread with a foe can be the beginning of lasting peace, sugar-glass sculptures can inspire architects to design soaring cities, and the fusion of disparate culinary traditions can tie cultures together.',
  'Bards from the College of Cuisine are prized in noble kitchens and rank-and-file mess halls alike. Peace treaties may be signed over hoisin-glazed duck with spiced jackfruit and crispy shallots, while the well-fed army wins the war on hearty oat and raisin porridge.',
  'Such bards never struggle to find employment; they travel where their work is appreciated, whether their diners are highborn or down-to-earth.',
];

export const collegeOfCuisineFeatures: CuisineFeature[] = [
  {
    level: 'Level 3',
    title: 'Culinary Exploration',
    summary: [
      'Years spent adapting recipes allow you to try unheard-of combinations of ingredients.',
      'You gain proficiency with cook’s utensils, which you can use as a spellcasting focus, and your proficiency bonus is doubled for any ability checks you make that use these utensils to prepare food.',
      'Whenever you craft a food, you can add one additional ingredient to the recipe, conferring the benefits of that ingredient to the dish on a successful Cooking check.',
    ],
  },
  {
    level: 'Level 3',
    title: 'Petit Fours',
    summary: [
      'During a short or long rest, you can create a number of magical treats equal to your Charisma modifier, minimum one.',
      'Choose one flavour from the list below to imbue the treats. They remain magical until you finish a short or long rest.',
      'A creature can use an action or bonus action to eat a treat, gaining a benefit based on the treat’s flavour, which, unless otherwise stated, lasts until the end of its next turn.',
      'As a bonus action, you can expend one use of your Bardic Inspiration, teleporting any number of treats on your person next to creatures you can see within 60 feet of you, where they hover near the creature’s mouth. Such a creature can use its reaction to eat the treat, or it can do so on its next turn as a bonus action. Otherwise, the treat falls to the ground.',
    ],
    flavorNotes: [
      'Bitter: resistance to poison damage and advantage on saving throws made to resist the poisoned condition.',
      'Salty: advantage on Wisdom saving throws and immunity to the charmed condition.',
      'Sour: weapon attacks deal bonus acid damage equal to one roll of your Bardic Inspiration die.',
      'Sweet: temporary hit points equal to one roll of your Bardic Inspiration die plus your Charisma modifier, minimum 1, lasting 1 hour.',
      'Umami: +2 bonus to AC.',
    ],
  },
  {
    level: 'Level 6',
    title: 'Culinary Specialization',
    summary: ['You pursue a particular style of cuisine, choosing from the list below and gaining its feature.'],
    bullets: [
      'Slow Cooking: gain proficiency with medium armour, heavy armour, shields, and martial weapons. At the start of each of your turns, you gain temporary hit points equal to your proficiency bonus.',
      'Fast Food: gain proficiency with medium armour and you can attack twice, instead of once, whenever you take the Attack action on your turn.',
      'Patissier: learn two spells of your choice from any spell list. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. These do not count against the number of bard spells you know. In addition, when you finish a short rest, you can expend one use of your Bardic Inspiration, rolling the die and recovering a number of levels of spell slots with a combined value equal to or less than the value rolled, and none of the spell slots can be 6th level or higher. Once you use this feature, you cannot do so again until you finish a long rest.',
    ],
  },
  {
    level: 'Level 14',
    title: 'Executive Chef',
    summary: [
      'Your confidence and authority in the kitchen translates to battlefield command.',
      'When a creature that can hear you rolls one of your Bardic Inspiration dice or eats one of your Petit Fours, you can shout authoritative, verbal encouragement, no action required.',
      'The creature can immediately use its reaction to either make one weapon attack or move up to its speed without provoking opportunity attacks.',
      'A creature that eats a Petit Fours can attack or move as described as part of the same reaction, action, or bonus action used to eat the Petit Fours.',
    ],
  },
];
