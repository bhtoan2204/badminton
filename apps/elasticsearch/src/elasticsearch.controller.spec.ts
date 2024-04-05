import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchController } from './elasticsearch.controller';
import { ElasticsearchService } from './elasticsearch.service';

describe('ElasticsearchController', () => {
  let elasticsearchController: ElasticsearchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ElasticsearchController],
      providers: [ElasticsearchService],
    }).compile();

    elasticsearchController = app.get<ElasticsearchController>(ElasticsearchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(elasticsearchController.getHello()).toBe('Hello World!');
    });
  });
});
