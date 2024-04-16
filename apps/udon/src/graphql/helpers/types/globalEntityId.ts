import { globalIdField } from 'graphql-relay';

export default (name: string) => ({
  id: globalIdField(name, (instance: any) => instance.entityId),
});
