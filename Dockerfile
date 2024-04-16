FROM node:20-alpine AS base

# Note: findutils is required to make the xargs command
# in ./entrypoint.sh work correctly, as the default xargs
# installed in Alpine Linux has different behaviour for
# the `-I` flag.
RUN apk add --no-cache python3 jq aws-cli findutils gcc make g++

WORKDIR /usr/src/app

FROM base AS runner

ARG BUILD_COMMIT_SHA
ENV COMMIT_SHA=$BUILD_COMMIT_SHA
ENV NODE_ENV=production

COPY . .

RUN yarn workspaces focus && \
  yarn workspace miso run build && \
  yarn workspace udon run build && \
  yarn workspaces focus --production && \
  yarn cache clean --all && \
  # Remove unused build cache to reduce image size (https://github.com/vercel/next.js/discussions/31395)
  rm -rf apps/miso/.next/cache

ENTRYPOINT ["./entrypoint.sh"]
CMD ["echo", "Provide an override CMD to run a specific process"]
