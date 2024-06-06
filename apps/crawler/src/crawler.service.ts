import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  async fetchProducts(keyword: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://shopee.vn/search?keyword=${encodeURIComponent(keyword)}`,
      );
      const $ = cheerio.load(response.data);
      const products = [];
      $('ul.row.shopee-search-item-result__items > li').each((i, el) => {
        const title = $(el).find('.some-title-class').text();
        const price = $(el).find('.some-price-class').text();
        products.push({ title, price });
      });
      return products;
    } catch (error) {
      throw new Error('Không thể tải dữ liệu từ Shopee');
    }
  }
}
