import test from 'ava';

import { Scraper } from '../src/scraping/scraper';

const uri = 'https://gist.github.com/Nyasaki/7ead02f517bc23fad8f58abc46fa8dab';
const raw = '/raw/5baf3b0387e7c59204aab909ab1371752df73af7/nyasaki_de.ts';

test('scrape', async (t) => {
    const res = await Scraper.GetRawUrl(uri);

    t.is(uri + raw, res);
});
