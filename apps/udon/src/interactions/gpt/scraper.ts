import fetch from 'node-fetch';
import fs from 'fs';
import { promisify } from 'util';
const { convert } = require('html-to-text');

import { GptErrors, GptMethod } from 'bento-common/types';

import detachPromise from 'src/utils/detachPromise';
import { logger } from 'src/utils/logger';
import { IS_DEVELOPMENT } from 'src/utils/constants';
import { ReportDump } from 'src/data/models/Audit/ReportDump.model';
import { enableExternalWebscraper } from 'src/utils/internalFeatures/internalFeatures';

const writeFile = promisify(fs.writeFile);

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY;

/** Turn on to dump the scraper's returned text */
const SCRAPER_DUMP = false;

/** If the text is under this number of words it's probably dummy/filler content */
const MIN_ACCEPTED_WORDS = 20;

enum ScraperMethod {
  scraperapi = 'scraperapi',
  /** Unreliable */
  fetch = 'fetch',
}

const METHOD: ScraperMethod = ScraperMethod.scraperapi as ScraperMethod;

/**
 * Use a simple fetch GET request to get HTML contents.
 *   We don't expect a very high hit rate here, sadly.
 */
export const gatherLinkContents = async (
  links: string[],
  method = GptMethod.baseScraper
) => {
  const contents: string[] = [];
  logger.debug(
    `[gatherLinkContentsFetch] Building page content for ${links.length} links`
  );
  const start = Date.now();

  try {
    for (const link of links) {
      const converted = await apiScrape(link, method);

      if (converted) contents.push(converted);
    }
  } catch (e: any) {
    logger.error(
      `[gatherLinkContentsFetch] failed to fetch-scrape: ${e.message}`,
      e
    );
  }

  logger.debug(
    `[gatherLinkContentsFetch] Time taken to scrape: ${
      Date.now() - start
    }ms. Contents gathered: ${contents.length}`
  );

  /* Could not gather any content */
  if (contents.length === 0) {
    if (method !== GptMethod.externalScraper)
      throw new Error(GptErrors.staticScrapeError);

    throw new Error(GptErrors.scrapeError);
  }

  return contents;
};

export const apiScrape = async (
  link: string,
  scrapeMethod = GptMethod.baseScraper
) => {
  let html = '';
  let status = 200;

  const usePremium = await enableExternalWebscraper.enabled();

  const fallback = () => {
    /**
     * If external allowed and we used fetch, give the option to try again
     * Otherwise throw a final error
     */
    if (scrapeMethod !== GptMethod.externalScraper)
      throw new Error(GptErrors.staticScrapeError);

    throw new Error(GptErrors.scrapeError);
  };

  const method =
    scrapeMethod !== GptMethod.baseScraper ? METHOD : ScraperMethod.fetch;

  try {
    logger.debug(`[apiScrape] Starting API scrape for ${link} w/ ${METHOD}`);

    switch (method) {
      case ScraperMethod.scraperapi: {
        if (!SCRAPERAPI_KEY) return fallback();

        const res = await fetch(
          `http://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}&url=${link}&render=true${
            usePremium ? '&premium=true' : ''
          }`
        );
        html = await res.text();
        status = res.status;
        break;
      }
      case ScraperMethod.fetch:
      default:
        return localScrape(link);
    }

    const converted = (convert(html, { wordWrap: 130 }) as string)
      .replace(/\n\s*\n/g, '')
      .substring(0, 8000);
    const hasContent = converted && validContent(converted);

    logger.debug(
      `[apiScrape] response status ${status}, usePremium: ${usePremium}`
    );

    /* Catch API error, e.g. protected routes */
    if (status > 400) return fallback();

    if (hasContent && SCRAPER_DUMP) dumpText(converted);

    if (!hasContent)
      reportScrapeFail({
        link,
        method: METHOD,
        txt: html,
        length: html.length,
        converted,
        fetchStatus: status,
      });
    else return converted;
  } catch (e: any) {
    logger.error(`[apiScrape] Uncaught error ${e.message}`, e);
    return fallback();
  }
};

const localScrape = async (link: string) => {
  logger.debug(`[localScrape] Starting local scrape for ${link}`);

  const res = await fetch(link);
  const txt = await res.text();
  const converted: string = convert(txt);

  const hasContent = converted && validContent(converted);

  if (hasContent && SCRAPER_DUMP) dumpText(converted);

  if (!hasContent)
    reportScrapeFail({
      link,
      method: ScraperMethod.fetch,
      txt,
      length: txt.length,
      converted,
      fetchStatus: res.status,
    });
  else return converted;
};

const reportScrapeFail = (json: object) =>
  detachPromise(
    () =>
      ReportDump.create({
        title: 'Help center scrape failure',
        content: 'No content extracted. See json',
        json,
      }),
    'scrape fail report'
  );

/**
 * Only allow for local as to not muck up an instance
 */
const dumpText = (text: string) => {
  if (!IS_DEVELOPMENT) return;

  detachPromise(
    () => writeFile(`./scraper_dump_${Date.now()}.log`, text),
    'scraper dump'
  );
};

const blockedMessage = [
  'turn javascript on',
  'enable javascript',
  'checking your browser',
  'redirecting',
  'Request failed',
];

/** Crude check for JS loaded pages */
const validContent = (text: string) => {
  if (text.split(' ').length < MIN_ACCEPTED_WORDS) return false;

  const _text = text.toLowerCase();
  if (blockedMessage.some((msg) => _text.includes(msg))) return false;

  return true;
};
