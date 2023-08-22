interface LanguageConfig {
  lang: string;
  baseUrl: string;
  menuUrl: string;
  searchUrl: string;
  otherSizes: string;
  caloriesPrefix: string;
  measurementRegex: {
    carb: RegExp;
    protein: RegExp;
    fat: RegExp;
    calories: RegExp;
  };
}

export const languanges: LanguageConfig[] = [
  {
    lang: "en",
    baseUrl: "https://www.fatsecret.com",
    menuUrl: "https://www.fatsecret.com/calories-nutrition",
    searchUrl: "https://www.fatsecret.com/calories-nutrition/search",
    otherSizes: "Other sizes:",
    caloriesPrefix: "kcal",
    measurementRegex: {
      carb: /Carbs:|g/g,
      protein: /Protein:|g/g,
      fat: /Fat:|g/g,
      calories: /Calories:|kcal/g,
    },
  },
  {
    lang: "ko",
    baseUrl: "https://www.fatsecret.kr",
    menuUrl: "https://www.fatsecret.kr/칼로리-영양소",
    searchUrl: "https://www.fatsecret.kr/칼로리-영양소/search",
    otherSizes: "Other sizes:", 
    caloriesPrefix: "kcal", 
    measurementRegex: { 
       calories: /칼로리:|kcal/g,  
       carb: /탄수화물:|g/g,    
       fat: /지방:|g/g, 
       calories: /Cal:|kcal/g,
       protein: /단백질:|g/g, 
    },
  },
];

export function getLang(langCode: string): LanguageConfig | null {
  const lang = languanges.filter((lg) => lg.lang === langCode)[0];
  return lang || null;
}
