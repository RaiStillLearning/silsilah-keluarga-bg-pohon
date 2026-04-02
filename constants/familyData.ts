// ── Types ────────────────────────────────────────────────────────────────────
export type TreeNode = {
  name: string;
  birthYear?: string;
  residence?: string;
  image?: string;
  children?: TreeNode[];
};

// ── Family data (34 Members matching tree slots exactly) ────────────────────────
export const familyData: TreeNode = {
  name: "Cadera", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cadera",
  children: [
    {
      name: "Budi", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi", children: [
        { name: "Lila", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lila", children: [
            { name: "Farhan", birthYear: "2000", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan" }
        ]}
      ]
    },
    {
      name: "H. Hamid", birthYear: "1910", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HHamid",
      children: [
        {
          name: "Ramli", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramli",
          children: [
            {
              name: "Dian", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dian",
              children: [
                {
                  name: "Putri", birthYear: "2000", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Putri",
                  children: [
                    { name: "Dinda", birthYear: "2030", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinda" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Hj. Aminah", birthYear: "1910", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HjAminah",
      children: [
        {
          name: "Sari", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sari",
          children: [
            {
              name: "Zahra", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra",
            }
          ]
        }
      ]
    },
    {
      name: "Ust. Ahmad", birthYear: "1910", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=UstAhmad",
      children: [
        {
          name: "Hendra", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra",
          children: [
            {
              name: "Kevin", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
              children: [
                {
                  name: "Ariel", birthYear: "2000", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ariel",
                  children: [
                    { name: "Ahmad", birthYear: "2030", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Hj. Fatimah", birthYear: "1910", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HjFatimah",
      children: [
        {
          name: "Tono", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tono",
          children: [
            {
              name: "Bagas", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bagas",
              children: [
                {
                  name: "Salsa", birthYear: "2000", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salsa",
                  children: [
                    { name: "Rafi", birthYear: "2030", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafi" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "H. Mansur", birthYear: "1910", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HMansur",
      children: [
        {
          name: "Wulan", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wulan",
          children: [
            {
              name: "Cinta", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cinta",
              children: [
                {
                  name: "Hafiz", birthYear: "2000", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hafiz",
                  children: [
                    { name: "Nisa", birthYear: "2030", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nisa" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Hj. Maryam", birthYear: "1910", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HjMaryam",
      children: [
        {
          name: "Andi", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi",
          children: [
            {
              name: "Maya", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
              children: [
                {
                  name: "Rizki", birthYear: "2000", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "H. Rudi", birthYear: "1910", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HRudi",
      children: [
        {
          name: "Rina", birthYear: "1940", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
          children: [
            {
              name: "Faisal", birthYear: "1970", residence: "Unknown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Faisal",
            }
          ]
        }
      ]
    },
  ]
};

export const ANCESTORS = []; // Unused now, everyone is in the main tree.

// ── FIXED_SLOTS (34 positions mapped precisely to the white bubbles) ─────────
export const FIXED_SLOTS: Record<string, [number, number]> = {
  "H. Hamid": [0.175, 0.635],
  "Hj. Aminah": [0.262, 0.636],
  "Ust. Ahmad": [0.35, 0.636],
  "Cadera": [0.437, 0.636],
  "Hj. Fatimah": [0.56, 0.636],
  "H. Mansur": [0.648, 0.636],
  "Hj. Maryam": [0.735, 0.636],
  "H. Rudi": [0.824, 0.636],
  "Ramli": [0.148, 0.518],
  "Sari": [0.234, 0.518],
  "Hendra": [0.322, 0.518],
  "Budi": [0.41, 0.518],
  "Tono": [0.589, 0.518],
  "Wulan": [0.675, 0.518],
  "Andi": [0.764, 0.518],
  "Rina": [0.851, 0.518],
  "Dian": [0.175, 0.401],
  "Zahra": [0.262, 0.401],
  "Kevin": [0.35, 0.401],
  "Lila": [0.438, 0.401],
  "Bagas": [0.56, 0.401],
  "Cinta": [0.647, 0.401],
  "Maya": [0.735, 0.401],
  "Faisal": [0.824, 0.401],
  "Putri": [0.263, 0.283],
  "Ariel": [0.35, 0.283],
  "Farhan": [0.437, 0.283],
  "Salsa": [0.56, 0.283],
  "Hafiz": [0.648, 0.283],
  "Rizki": [0.735, 0.283],
  "Dinda": [0.322, 0.166],
  "Ahmad": [0.41, 0.166],
  "Rafi": [0.589, 0.166],
  "Nisa": [0.675, 0.166],
};

// ── ALL_EDGES (Matches visual branches perfectly) ───────────────────────────
export const ALL_EDGES: [string, string][] = [
  ["H. Hamid", "Ramli"],
  ["Hj. Aminah", "Sari"],
  ["Ust. Ahmad", "Hendra"],
  ["Cadera", "Budi"],
  ["Hj. Fatimah", "Tono"],
  ["H. Mansur", "Wulan"],
  ["Hj. Maryam", "Andi"],
  ["H. Rudi", "Rina"],
  ["Ramli", "Dian"],
  ["Sari", "Zahra"],
  ["Hendra", "Kevin"],
  ["Budi", "Lila"],
  ["Tono", "Bagas"],
  ["Wulan", "Cinta"],
  ["Andi", "Maya"],
  ["Rina", "Faisal"],
  ["Dian", "Putri"],
  ["Kevin", "Ariel"],
  ["Lila", "Farhan"],
  ["Bagas", "Salsa"],
  ["Cinta", "Hafiz"],
  ["Maya", "Rizki"],
  ["Putri", "Dinda"],
  ["Ariel", "Ahmad"],
  ["Salsa", "Rafi"],
  ["Hafiz", "Nisa"],
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function flattenTree(n: TreeNode): TreeNode[] {
  return [n, ...(n.children ?? []).flatMap(flattenTree)];
}
export function getSubtreeNames(n: TreeNode): Set<string> {
  const s = new Set<string>([n.name]);
  (n.children ?? []).forEach(c => getSubtreeNames(c).forEach(x => s.add(x)));
  return s;
}
export function getDepthMap(n: TreeNode, d = 0): Record<string, number> {
  const m: Record<string, number> = { [n.name]: d };
  (n.children ?? []).forEach(c => Object.assign(m, getDepthMap(c, d + 1)));
  return m;
}
export function findPath(root: TreeNode, target: string, path: TreeNode[] = []): TreeNode[] | null {
  const p = [...path, root];
  if (root.name === target) return p;
  for (const c of root.children ?? []) { const r = findPath(c, target, p); if (r) return r; }
  return null;
}
