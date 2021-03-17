import axios from 'axios';
import cheerio from 'cheerio';
import xpath from 'xpath';
import {DOMParser} from 'xmldom';

export async function urlsOfSitemap(url: string): Promise<string[]> {
    return axios.get(url)
        .then((r: { data: string; }) => r.data)
        .then((data: string) => (new DOMParser()).parseFromString(data))
        .then((doc: Document) => {
            const expr = xpath.useNamespaces({
                sitemap: 'http://www.sitemaps.org/schemas/sitemap/0.9',
            });
            return expr('//sitemap:urlset/sitemap:url/sitemap:loc/text()', doc)
                .filter<Text>((value): value is Text => {
                    return (value as Text).splitText !== undefined;
                });
        })
        .then((texts: Text[]) => {
            return texts.map(text => text.data);
        })
}

export type Content = {
    id?: string;
    url: string;
    title: string;
    author: string;
    tag?: string;
    time?: string;
}

export async function parseLoc(url: string): Promise<Content> {
    return axios.get(url)
        .then((r: { data: string; }) => r.data)
        .then(cheerio.load)
        .then($ => ({
            id: $('article').attr('id')?.valueOf().replace(/post-/, ''),
            url: url,
            title: $('title').text(),
            author: $('span.author').text(),
            tag: $('span.article-tag').text().trim(),
            time: $('time').attr('datetime')?.valueOf(),

        }))
}
