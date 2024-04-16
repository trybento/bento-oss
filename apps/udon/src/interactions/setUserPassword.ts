import { QueryDatabase, queryRunner } from 'src/data/index';
import { AuthType } from 'src/data/models/types';
import { User } from 'src/data/models/User.model';

type Data = {
  userId: number;
  password: string;
};

const UPSERT_EMAIL_AUTH_SQL = `
  INSERT INTO
    core.user_auths (key, user_id, type)
  VALUES
    (crypt(:password, gen_salt('bf')), :userId, :authType)
  ON CONFLICT (user_id, type) DO
    UPDATE SET key = crypt(:password, gen_salt('bf'));
`;

/**
 * Should ONLY be used for the `email` auth method.
 */
export async function setUserPassword({ userId, password }: Data) {
  await queryRunner({
    sql: UPSERT_EMAIL_AUTH_SQL,
    replacements: {
      authType: AuthType.email,
      userId,
      password,
    },
    queryDatabase: QueryDatabase.primary,
  });

  await User.update(
    { sessionsValidFrom: new Date() },
    { where: { id: userId } }
  );
}
