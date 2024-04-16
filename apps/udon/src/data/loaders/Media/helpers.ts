import { MediaReferenceType } from 'bento-common/types/media';
import { queryRunner } from 'src/data';

export const getMediaReferenceLoaderRows = async ({
  referenceType,
  referenceIds,
}: {
  referenceType: MediaReferenceType;
  referenceIds: number[];
}) => {
  return (await queryRunner({
    sql: `
        SELECT
            mr.id AS "id",
            mr.reference_id AS "mediaReferenceId"
        FROM
            core.media_references mr
        WHERE
            mr.reference_id IN (:referenceIds)
            AND mr.reference_type = :referenceType
        ORDER BY
            mr.reference_id ASC,
            mr.order_index ASC;
    `,
    replacements: {
      referenceType: MediaReferenceType.stepPrototype,
      referenceIds: referenceIds as number[],
    },
  })) as { id: number; mediaReferenceId: number }[];
};
