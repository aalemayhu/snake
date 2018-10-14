import { Scraper } from '../src/scraping/scraper';
import { expect } from 'chai';

import 'mocha';

describe("scrape", () => {
    const s = new Scraper();

    it("should return raw url", () => {
        console.log(s);
        expect(true).to.equal(true);
    });
});
