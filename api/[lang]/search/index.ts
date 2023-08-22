import { VercelResponse, VercelRequest } from "@vercel/node";
import cheerio from "cheerio";
import { fetchHTML } from "../../../utils/fetch";
import { getLang } from "../../../utils/lang";

interface ServingList {
  name: string;
  calories: number;
}

interface FoundList {
  title: string;
  serving: string;
  calories: number;
  fat: any;
  carb: any;
  protein: any;
}

interface DataResponse {
  items: FoundList[];
  next: number;
  prev: number;
  current: number;
  total: number;
}

export default async (
  request: VercelRequest,
  response: VercelResponse
)
: Promise<void> => {
  const query: any = request.query.query;
  const page: any = +request.query.page || 0;
  const langConfig = getLang(String(request.query.lang));

  if (!langConfig) {
    response.json({ error: `${request.query.lang} are not supported` });
    return;
  }

  if (!query) {
    response.json({ error: "Please insert a query, q=??" });
    return;
  }

  const html = await fetchHTML(langConfig.searchUrl, {
    q: query,
    pg: page,
  });
  const $ = cheerio.load(html);
  const items: FoundList[] = [];

  $("table.generic.searchResult td.borderBottom").each((_: any, elem: any) => {
    const element = $(elem);
    const title = element.find("a.prominent");
    const linkText = title.text();
    const normalizeText = element
      .find("div.smallText.greyText.greyLink")
      .text()
      .replace(/(\r\n|\n|\r\t|\t|\r)/gm, "");

    const splitSection = normalizeText.split(langConfig.otherSizes);
    const splitGeneralInfoString = splitSection[0].split("-");
    const generalInfo = splitGeneralInfoString[1].split("|");

    const calories =
      +generalInfo[0]
      .replace(langConfig.measurementRegex.calories, "") || 0;

    const fat =
      +generalInfo[1]
      .replace(langConfig.measurementRegex.fat, "")
      .replace(",", ".") || 0;

    const carb =
      +generalInfo[2]
      .replace(langConfig.measurementRegex.carb, "")
      .replace(",", ".") || 0;

    const protein =
      generalInfo[3]
      .replace(langConfig.measurementRegex.protein, "")
      .replace(",", ".")
      .trim() || 0;


    items.push ({
      title: linkText,
      calories,
      fat,
      carb,
      protein,
      serving: splitGeneralInfoString[0],
    });
  });

  const searchSum = $(".searchResultSummary").text().split(" ");
  const searchSumText = $(".searchResultSummary").text();
  const total = parseInt(searchSumText.replace(/\D/g, ""));
  const endOfPage = total === parseInt(searchSum[2]);
  const startOfPage = page < 1;
  const next = endOfPage ? 0 : parseInt(page) + 1;
  const prev = startOfPage ? 0 : parseInt(page) - 1;
  const data: DataResponse = {
    items,
    total,
    prev,
    next,
    current: parseInt(page),
  };
  response.setHeader("Cache-Control", "s-maxage=100, stale-while-revalidate");
  response.json(data);
};
