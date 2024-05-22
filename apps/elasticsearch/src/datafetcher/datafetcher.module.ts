import { ApolloFederationDriver, ApolloFederationDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { DatafetcherController } from "./datafetcher.controller";
import { DatafetcherService } from "./datafetcher.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        
      }
    }),
  ],
  controllers: [DatafetcherController],
  providers: [DatafetcherService],
})
export class DatafetcherModule { }