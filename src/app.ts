import yargs from 'yargs';
import {urlsOfSitemap} from "./client";

const argv = yargs(process.argv.slice(2))
    .options({
        sitemap: { type: 'string', alias: 's', demandOption: true },
    })
    .version(false)
    .argv;

urlsOfSitemap(argv.sitemap)
    .then(urls => console.log(urls));
