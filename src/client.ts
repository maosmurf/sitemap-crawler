import axios from 'axios';
import xpath from 'xpath';
import {DOMParser} from 'xmldom';

export function urlsOfSitemap(url: string): Promise<string[]> {
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
