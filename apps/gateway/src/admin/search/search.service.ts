import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { ELASTICSEARCH_SERVICE } from "../../utils";

@Injectable()
export class SearchService {
    constructor(
        @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy
    ) { }

    async getLogsCount() {
        try {
            const response = this.elasticsearchClient.send('elasticsearchClient/getLogsCount', {})
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
}