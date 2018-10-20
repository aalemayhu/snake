import test from 'ava';

import { Scraper } from '../src/scraping/scraper';

const uri = 'https://gist.github.com/Mobilpadde/c7df1a0b778eb6e06aa7dd6df19f3ee5';
const rgx = /^([\w+\:\/\.]+)(raw)\/(\w+)\/(smarty-pants)\.(snk)$/g;

test('scrape', async (t) => {
    const res = await Scraper.GetRawUrl(uri);

    t.truthy(rgx.test(res));
});
