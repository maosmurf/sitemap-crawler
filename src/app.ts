import yargs from 'yargs';
import {parseLoc, urlsOfSitemap} from "./client";

const argv = yargs(process.argv.slice(2))
    .options({
        sitemap: { type: 'string', alias: 's', demandOption: true },
        limit: { type: 'number', alias: 'l', default: 10 },
    })
    .version(false)
    .argv;

urlsOfSitemap(argv.sitemap)
    .then(urls => urls.slice(0, argv.limit))
    .then(urls => Promise.all(urls.map(parseLoc)))
    .then(locs => locs.forEach(loc => console.log(JSON.stringify(loc))));

