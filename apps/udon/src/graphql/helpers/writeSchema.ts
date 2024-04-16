import fs from 'fs';
import { graphql, getIntrospectionQuery, printSchema } from 'graphql';

export default async function writeSchema(
  schema: any,
  name: string,
  outputPath: string
) {
  console.log(`Writing ${name} Schema to Disk`);

  const output = await graphql(schema, getIntrospectionQuery(), null, {});

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
}

export async function printGlSchema(
  schema: any,
  name: string,
  outputPath: string
) {
  console.log(`Writing ${name} GraphQL Schema to Disk`);
  const note = `# Auto-generated using 'printSchema'. Do not edit.\n\n`;
  const sdl = printSchema(schema);
  fs.writeFileSync(outputPath, note + sdl);
}
