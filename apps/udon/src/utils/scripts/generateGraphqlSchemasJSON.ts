import 'src/preStart';
import path from 'path';
import writeSchema, { printGlSchema } from 'src/graphql/helpers/writeSchema';
import adminSchema from 'src/graphql/Schema';
import embedSchema from 'src/graphql/embed/EmbedSchema';
import visualBuilderSchema from '../../graphql/visualBuilder/VisualBuilderSchema';
import { makeDirIfNotExists } from '../helpers';

const generatedPath = path.resolve(__dirname, '../../../schemas/__generated__');
makeDirIfNotExists(generatedPath);
const generatedGraphqlPath = path.resolve(
  __dirname,
  '../../graphql/__generated__'
);
makeDirIfNotExists(generatedGraphqlPath);

void (async () => {
  await writeSchema(
    adminSchema,
    'Main',
    path.resolve(generatedPath, 'main.json')
  );
  await printGlSchema(
    adminSchema,
    'Main',
    path.resolve(generatedGraphqlPath, 'main.graphql')
  );

  await writeSchema(
    embedSchema,
    'Embed',
    path.resolve(generatedPath, 'embed.json')
  );
  await printGlSchema(
    embedSchema,
    'Embed',
    path.resolve(generatedGraphqlPath, 'embed.graphql')
  );

  await writeSchema(
    visualBuilderSchema,
    'VisualBuilder',
    path.resolve(generatedPath, 'visualBuilder.json')
  );
  await printGlSchema(
    visualBuilderSchema,
    'VisualBuilder',
    path.resolve(generatedGraphqlPath, 'visualBuilder.graphql')
  );
  process.exit();
})();
