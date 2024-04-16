import { Test, TestingModule } from '@nestjs/testing';
import { TusService } from './tus.service';

describe('TusService', () => {
  let service: TusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TusService],
    }).compile();

    service = module.get<TusService>(TusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
