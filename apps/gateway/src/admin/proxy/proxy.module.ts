import { RmqModule } from "@app/common";
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from "@nestjs/common";
import { ELASTICSEARCH_SERVICE } from "../../utils";
import { ProxyController } from "./proxy.controller";
import { ProxyService } from "./proxy.service";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    RmqModule.register({ name: ELASTICSEARCH_SERVICE }),
    // GraphQLModule.forRoot({
    //   autoSchemaFile: true,
    // }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule { }