export function generateGraphQLQuery(zoneTag: string, date_geq: string, date_leq: string, limit: number): string {
  return `{
    viewer {
      zones(filter: { zoneTag: "${zoneTag}" }) {
        httpRequests1dGroups(
          limit: ${limit}
          filter: { date_geq: "${date_geq}", date_leq: "${date_leq}" }
          orderBy: [date_ASC]
        ) {
          dimensions {
            date
          }
          sum {
            requests
            cachedRequests
            bytes
            cachedBytes
            threats
            pageViews
            browserMap {
              pageViews
              uaBrowserFamily
            }
            contentTypeMap {
              bytes
              edgeResponseContentTypeName
              requests
            }
            countryMap {
              bytes
              clientCountryName
              requests
              threats
            }
            encryptedBytes
            encryptedRequests
            responseStatusMap {
              edgeResponseStatus
              requests
            }
          }
          uniq {
            uniques
          }
        }
      }
    }
  }`;
}