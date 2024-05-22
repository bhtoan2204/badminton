import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { ELASTICSEARCH_SERVICE } from "../../utils";

@Injectable()
export class ProxyService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy
  ) { }

  async getZone() {
    try {
      const response = this.elasticsearchClient.send('proxyClient/getZone', {})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getZoneAnalyticsDashboard() {
    try {
      const response = this.elasticsearchClient.send('proxyClient/getZoneAnalyticsDashboard', {})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getRequestStatisticsQuery() {
    return { message: 'This is a sample data' };
  }

  async getProxyData(filter: any, httpRequestFilter) {
    return {
      "data": {
        "viewer": {
          "zones": [
            {
              "country": [
                {
                  "dimensions": {
                    "date": "2024-04-01"
                  },
                  "sum": {
                    "requests": 1482
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-02"
                  },
                  "sum": {
                    "requests": 1835
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-03"
                  },
                  "sum": {
                    "requests": 2151
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-04"
                  },
                  "sum": {
                    "requests": 3240
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-05"
                  },
                  "sum": {
                    "requests": 2931
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-06"
                  },
                  "sum": {
                    "requests": 68070
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-07"
                  },
                  "sum": {
                    "requests": 1335
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-08"
                  },
                  "sum": {
                    "requests": 13665
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-09"
                  },
                  "sum": {
                    "requests": 64586
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-10"
                  },
                  "sum": {
                    "requests": 16107
                  }
                }
              ],
              "httpRequests1dGroups": [
                {
                  "dimensions": {
                    "date": "2024-04-01"
                  },
                  "sum": {
                    "bytes": 10327176,
                    "cachedBytes": 2549992,
                    "cachedRequests": 802,
                    "pageViews": 57,
                    "requests": 1482,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 11
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-02"
                  },
                  "sum": {
                    "bytes": 2486058,
                    "cachedBytes": 1053544,
                    "cachedRequests": 75,
                    "pageViews": 9,
                    "requests": 1835,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 15
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-03"
                  },
                  "sum": {
                    "bytes": 10863034,
                    "cachedBytes": 1540926,
                    "cachedRequests": 79,
                    "pageViews": 48,
                    "requests": 2151,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 33
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-04"
                  },
                  "sum": {
                    "bytes": 18170861,
                    "cachedBytes": 3096428,
                    "cachedRequests": 182,
                    "pageViews": 1780,
                    "requests": 3240,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 8
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-05"
                  },
                  "sum": {
                    "bytes": 23601927,
                    "cachedBytes": 3143244,
                    "cachedRequests": 527,
                    "pageViews": 417,
                    "requests": 2931,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 23
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-06"
                  },
                  "sum": {
                    "bytes": 58763606,
                    "cachedBytes": 36216500,
                    "cachedRequests": 42499,
                    "pageViews": 38,
                    "requests": 68070,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 12
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-07"
                  },
                  "sum": {
                    "bytes": 1984551,
                    "cachedBytes": 501815,
                    "cachedRequests": 5,
                    "pageViews": 12,
                    "requests": 1335,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 6
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-08"
                  },
                  "sum": {
                    "bytes": 24405311,
                    "cachedBytes": 2565728,
                    "cachedRequests": 624,
                    "pageViews": 240,
                    "requests": 13665,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 9
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-09"
                  },
                  "sum": {
                    "bytes": 64614718,
                    "cachedBytes": 1113172,
                    "cachedRequests": 726,
                    "pageViews": 108,
                    "requests": 64586,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 12
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-10"
                  },
                  "sum": {
                    "bytes": 22381473,
                    "cachedBytes": 1669507,
                    "cachedRequests": 188,
                    "pageViews": 134,
                    "requests": 16107,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 5
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-11"
                  },
                  "sum": {
                    "bytes": 19639303,
                    "cachedBytes": 1292260,
                    "cachedRequests": 328,
                    "pageViews": 3791,
                    "requests": 21843,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 10
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-12"
                  },
                  "sum": {
                    "bytes": 5526995,
                    "cachedBytes": 987774,
                    "cachedRequests": 526,
                    "pageViews": 164,
                    "requests": 3242,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 10
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-13"
                  },
                  "sum": {
                    "bytes": 4228510,
                    "cachedBytes": 508178,
                    "cachedRequests": 168,
                    "pageViews": 69,
                    "requests": 1080,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 7
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-14"
                  },
                  "sum": {
                    "bytes": 3973069,
                    "cachedBytes": 1047312,
                    "cachedRequests": 80,
                    "pageViews": 260,
                    "requests": 1973,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 11
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-15"
                  },
                  "sum": {
                    "bytes": 2914190,
                    "cachedBytes": 1230508,
                    "cachedRequests": 288,
                    "pageViews": 162,
                    "requests": 1432,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 6
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-16"
                  },
                  "sum": {
                    "bytes": 7574998,
                    "cachedBytes": 2772721,
                    "cachedRequests": 1028,
                    "pageViews": 114,
                    "requests": 1659,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 11
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-17"
                  },
                  "sum": {
                    "bytes": 6238571,
                    "cachedBytes": 3882149,
                    "cachedRequests": 558,
                    "pageViews": 226,
                    "requests": 1807,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 16
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-18"
                  },
                  "sum": {
                    "bytes": 3097829,
                    "cachedBytes": 619662,
                    "cachedRequests": 107,
                    "pageViews": 45,
                    "requests": 597,
                    "threats": 1
                  },
                  "uniq": {
                    "uniques": 5
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-19"
                  },
                  "sum": {
                    "bytes": 22763221,
                    "cachedBytes": 1589147,
                    "cachedRequests": 129,
                    "pageViews": 53,
                    "requests": 20591,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 11
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-20"
                  },
                  "sum": {
                    "bytes": 39169990,
                    "cachedBytes": 434654,
                    "cachedRequests": 13,
                    "pageViews": 22,
                    "requests": 39570,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 7
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-21"
                  },
                  "sum": {
                    "bytes": 5423203,
                    "cachedBytes": 5361,
                    "cachedRequests": 11,
                    "pageViews": 42,
                    "requests": 4907,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 11
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-22"
                  },
                  "sum": {
                    "bytes": 13128679,
                    "cachedBytes": 686114,
                    "cachedRequests": 107,
                    "pageViews": 49,
                    "requests": 1938,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 12
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-23"
                  },
                  "sum": {
                    "bytes": 12698997,
                    "cachedBytes": 726133,
                    "cachedRequests": 180,
                    "pageViews": 64,
                    "requests": 1967,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 17
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-24"
                  },
                  "sum": {
                    "bytes": 10837223,
                    "cachedBytes": 2406372,
                    "cachedRequests": 1091,
                    "pageViews": 620,
                    "requests": 3190,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 14
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-25"
                  },
                  "sum": {
                    "bytes": 4325107,
                    "cachedBytes": 2655635,
                    "cachedRequests": 427,
                    "pageViews": 211,
                    "requests": 869,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 14
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-26"
                  },
                  "sum": {
                    "bytes": 2001368,
                    "cachedBytes": 935693,
                    "cachedRequests": 561,
                    "pageViews": 425,
                    "requests": 1100,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 5
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-27"
                  },
                  "sum": {
                    "bytes": 1788841,
                    "cachedBytes": 928458,
                    "cachedRequests": 88,
                    "pageViews": 8,
                    "requests": 737,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 9
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-28"
                  },
                  "sum": {
                    "bytes": 12872215,
                    "cachedBytes": 1736591,
                    "cachedRequests": 315,
                    "pageViews": 815,
                    "requests": 3338,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 17
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-29"
                  },
                  "sum": {
                    "bytes": 7916379,
                    "cachedBytes": 1690304,
                    "cachedRequests": 275,
                    "pageViews": 342,
                    "requests": 2618,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 31
                  }
                },
                {
                  "dimensions": {
                    "date": "2024-04-30"
                  },
                  "sum": {
                    "bytes": 5385511,
                    "cachedBytes": 1361638,
                    "cachedRequests": 451,
                    "pageViews": 429,
                    "requests": 1492,
                    "threats": 0
                  },
                  "uniq": {
                    "uniques": 15
                  }
                }
              ]
            }
          ]
        }
      },
      "errors": null
    }
  }
}