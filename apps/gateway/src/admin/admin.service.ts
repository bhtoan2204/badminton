import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
    constructor(
    ) { }

    test() {
      return 'test';
    }
}