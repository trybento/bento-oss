export interface ConnectionArgs<T extends string = string> {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  orderDirection?: 'desc' | 'asc';
  orderBy?: T;
}
interface SqlOptions {
  order: 'asc' | 'desc';
  offset?: number;
  limit?: number;
}

interface SqlResultRow extends Record<string, unknown> {
  full_count?: number | string;
}

type Cursor = {
  id: number;
  index: number;
};

export function sqlFromConnectionArgs(args: ConnectionArgs) {
  const options: SqlOptions = { order: 'asc' };

  if (args.first || args.last) {
    const firstOrLastArg = (args.first || args.last)!;
    // @ts-ignore
    options.limit = parseInt(firstOrLastArg, 10);
  }

  if (args.last) {
    options.order = options.order === 'asc' ? 'desc' : 'asc';
  }

  if (args.after || args.before) {
    const cursor = fromCursor((args.after || args.before)!);
    const startIndex = Number(cursor.index);

    if (startIndex >= 0) options.offset = startIndex + 1;
  }

  return options;
}

export function connectionFromSqlResult({
  values,
  source,
  args,
  fullCount,
  skipFullCount,
}: {
  values: SqlResultRow[];
  source: any;
  args: ConnectionArgs;
  fullCount?: number;
  skipFullCount?: boolean;
}) {
  let cursor: Cursor | null = null;
  if (args.after || args.before) {
    cursor = fromCursor(args.after || args.before || '');
  }

  const edges = values.map((value, idx) =>
    constructEdge(value, idx, cursor, args, source)
  );

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  let _fullCount = 0;

  if (!skipFullCount) {
    // Check for full_count column if we haven't explicitly set the fullCount already
    // If we have set fullCountArg, use it
    if (fullCount) {
      _fullCount = fullCount;
    } else if (values[0]) {
      const value = values[0];
      if (value.full_count) {
        // @ts-ignore
        fullCount = parseInt(value.full_count, 10);
      }
    }
  }

  let hasNextPage = false;
  let hasPreviousPage = false;
  if (args.first || args.last) {
    // @ts-ignore
    const count = parseInt(args.first || args.last, 10);
    let index = cursor ? Number(cursor.index) : null;
    if (index !== null) {
      index++;
    } else {
      index = 0;
    }

    if (!skipFullCount) {
      hasNextPage = index + 1 + count <= _fullCount;
    } else {
      hasNextPage = values.length > 0;
    }

    hasPreviousPage = index - count >= 0;

    if (args.last) {
      [hasNextPage, hasPreviousPage] = [hasPreviousPage, hasNextPage];
    }
  }

  const { limit, offset = 0 } = sqlFromConnectionArgs(args);

  return {
    source,
    args,
    edges,
    total: skipFullCount ? undefined : _fullCount,
    limit,
    offset,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasNextPage,
      hasPreviousPage,
    },
  };
}

export function constructEdge(
  item: any,
  index: number,
  queriedCursor: Cursor | null,
  sourceArgs: ConnectionArgs = {},
  source: any
) {
  let startIndex: number | null = null;
  if (queriedCursor) startIndex = Number(queriedCursor.index);
  if (startIndex !== null) {
    startIndex++;
  } else {
    startIndex = 0;
  }

  return {
    cursor: toCursor(item, index + startIndex),
    node: item,
    source: source,
    sourceArgs,
  };
}

export function isOnlyTotalRequested(info: any) {
  // This shouldn't happen, but better to be safe than sorry
  if (!info.fieldNodes || info.fieldNodes.length === 0) return false;
  const { selections } = info.fieldNodes[0].selectionSet;
  const fields = selections.filter((s) => s.kind === 'Field');
  return fields.length === 1 && fields[0].name.value === 'total';
}

function toCursor(item: any, idx: number) {
  const id = item.id || (typeof item.get === 'function' && item.get('id'));
  return base64(JSON.stringify([id, idx]));
}

function fromCursor(cursor: string) {
  const [id, index] = JSON.parse(unbase64(cursor));

  return {
    id,
    index,
  };
}

function base64(i: string) {
  return Buffer.from(i, 'ascii').toString('base64');
}

function unbase64(i: string) {
  return Buffer.from(i, 'base64').toString('ascii');
}
