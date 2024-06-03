import * as process from 'process';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { context, trace, SpanKind, SpanStatusCode } from '@opentelemetry/api';

export const initTracing = async (serviceName: string): Promise<void> => {
  let traceExporter;
  try {
    traceExporter = new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces',
    });
    console.log('JaegerExporter created');
  } catch (error) {
    console.error('Error creating JaegerExporter', error);
    return;
  }

  let sdk;
  try {
    sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
      instrumentations: [
        getNodeAutoInstrumentations(),
        new AmqplibInstrumentation(),
      ],
      spanProcessor: new SimpleSpanProcessor(traceExporter),
    });
    console.log('NodeSDK created');
  } catch (error) {
    console.error('Error creating NodeSDK', error);
    return;
  }

  try {
    await sdk.start();
    console.log('Tracing initialized');
  } catch (error) {
    console.error('Error initializing tracing', error);
    return;
  }

  process.on('SIGTERM', async () => {
    try {
      await sdk.shutdown();
      console.log('Tracing terminated');
    } catch (error) {
      console.error('Error terminating tracing', error);
    } finally {
      process.exit(0);
    }
  });
};

export const traceFunction = async (fn: () => Promise<void>, functionName: string) => {
  const tracer = trace.getTracer('default');
  const span = tracer.startSpan(functionName, {
    kind: SpanKind.INTERNAL,
  });

  try {
    await context.with(trace.setSpan(context.active(), span), fn);
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.recordException(error);
    console.error('Error in traced function', error);
    throw error; // Re-throw the error after recording it
  } finally {
    span.end();
  }
};
