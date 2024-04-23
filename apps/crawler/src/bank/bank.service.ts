import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";
import puppeteer from 'puppeteer';

@Injectable()
export class BankService {
  constructor(
    private readonly configService: ConfigService
  ) { }

  async scrapeInterestRatesLocalBank() {
    try {
      const url = this.configService.get<string>('LOCAL_BANK_INTEREST_URL');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
  
      const results = await page.evaluate(() => {
        const keys = ["Không Kỳ Hạn", "01 tháng", "03 tháng", "06 tháng", "09 tháng", "12 tháng", "13 tháng", "18 tháng", "24 tháng", "36 tháng"];
  
        const rowsQuay = Array.from(document.querySelectorAll("#lai_suat_tiet_kiem_tai_quay table tbody tr"));
        const interestRatesCounter = rowsQuay.map(row => {
          const columns = Array.from(row.querySelectorAll("td"));
          const rateDetails = columns.slice(1).map(td => td.textContent.trim());
          if (rateDetails.length !== 10) {
            return null;
          }
          const rateObject = Object.fromEntries(rateDetails.map((rate, index) => [keys[index], rate]));
          return {
            bankName: columns[0].textContent.trim(),
            rates: rateObject
          };
        });
  
        const rowsOnline = Array.from(document.querySelectorAll("#lai_suat_tiet_kiem_online table tbody tr"));
        const interestRatesOnline = rowsOnline.map(row => {
          const columns = Array.from(row.querySelectorAll("td"));
          const rateDetails = columns.slice(1).map(td => td.textContent.trim());
          if (rateDetails.length !== 10) {
            return null;
          }
          const rateObject = Object.fromEntries(rateDetails.map((rate, index) => [keys[index], rate]));
          return {
            bankName: columns[0].textContent.trim(),
            rates: rateObject
          };
        });
  
        return { interestRatesCounter, interestRatesOnline };
      }).then(results => {
        return {
          interestRatesCounter: results.interestRatesCounter.filter(result => result !== null),
          interestRatesOnline: results.interestRatesOnline.filter(result => result !== null)
        };
      });
  
      await browser.close();
      return results;
  
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}

