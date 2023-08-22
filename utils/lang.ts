interface LanguageConfig {
  lang: string;
  baseUrl: string;
  menuUrl: string;
  searchUrl: string;
  otherSizes: string;
  caloriesPrefix: string;
  measurementRegex: {
    calories: RegExp;
    carb: RegExp;
    fat: RegExp;
    protein: RegExp;
  };
}

export const languanges: LanguageConfig[] = [{
  lang: "ko",
  baseUrl: "https://www.fatsecret.kr",
  menuUrl: "https://www.fatsecret.kr/칼로리-영양소",
  searchUrl: "https://www.fatsecret.kr/칼로리-영양소/search",
  otherSizes: "서빙 사이즈",
  caloriesPrefix: "kcal",
  measurementRegex: {
    calories: /열량.*?(\d+)\s*kJ.*?(\d+)\s*kcal/g,  
    carb: /탄수화물.*?(\d+\.?\d*)g/g,    
    fat: /지방.*?(\d+\.?\d*)g/g,
    protein: /단백질.*?(\d+\.?\d*)g/g
  }
}];


export function getLang(langCode: string): LanguageConfig | null {
  const lang = languanges.filter((lg) => lg.lang === langCode)[0];
  return lang || null;
}
