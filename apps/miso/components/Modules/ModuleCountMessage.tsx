import React, { FC, useCallback, useEffect, useState } from 'react';
import TemplatesUsingModuleQuery from 'queries/TemplatesUsingModuleQuery';
import {
  Box,
  FormLabel,
  Link,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  UnorderedList,
} from '@chakra-ui/react';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import { isFakeId } from 'bento-common/data/fullGuide';

export interface ModuleUsage {
  count: number;
  Popover: FC;
  list: { label: string; link: string }[];
}

export const useModuleUsage = (
  count: number,
  moduleEntityId: string,
  excludeTemplateEntityId?: string,
  disabled?: boolean
): ModuleUsage | null => {
  const [list, setList] = useState<ModuleUsage['list']>([]);

  const listQuery = useCallback(async () => {
    if (!moduleEntityId || isFakeId(moduleEntityId)) return [];
    const res = await TemplatesUsingModuleQuery(moduleEntityId);

    setList(
      res.module?.templates
        ?.filter(
          excludeTemplateEntityId
            ? (t) => t.entityId !== excludeTemplateEntityId
            : Boolean
        )
        .map(({ name, entityId }) => ({
          label: name,
          link: `/library/templates/${entityId}`,
        }))
    );
  }, []);

  useEffect(() => {
    void listQuery();
  }, []);

  return count && !disabled
    ? {
        count,
        list,
        Popover: ({ children }) => (
          <Popover
            trigger="hover"
            placement="bottom-start"
            isLazy
            lazyBehavior="unmount"
          >
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent boxShadow={STANDARD_SHADOW}>
              <PopoverBody>
                <Box display="grid" padding="1em 0em 1em 1em">
                  <FormLabel>Used in the following guides:</FormLabel>
                  <UnorderedList pl="2">
                    {list.map((item, idx) => {
                      return (
                        <ListItem
                          key={`module-usage-popover-${item.label}-${idx}`}
                        >
                          {item.link ? (
                            <Link
                              target="_blank"
                              color="bento.bright"
                              href={item.link}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            item.label
                          )}
                        </ListItem>
                      );
                    })}
                  </UnorderedList>
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ),
      }
    : null;
};
