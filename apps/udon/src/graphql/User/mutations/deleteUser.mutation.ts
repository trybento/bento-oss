import { GraphQLID, GraphQLNonNull } from 'graphql';

import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import { toGlobalId } from 'graphql-relay';
import { User } from 'src/data/models/User.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

export default generateMutation({
  name: 'DeleteUser',
  description: 'Delete an user of an organization',
  inputFields: {
    userEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    deletedUserId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async ({ userEntityId }, { organization }) => {
    const user = await User.findOne({
      where: {
        entityId: userEntityId,
        organizationId: organization.id,
      },
    });

    if (!user) {
      return {
        errors: ['User not found'],
      };
    }

    await user.destroy();

    await queueJob({
      jobType: JobType.DeleteObjects,
      type: 'user',
      organizationId: organization.id,
      objectIds: [user.id],
    });

    return { deletedUserId: toGlobalId('User', userEntityId) };
  },
});
