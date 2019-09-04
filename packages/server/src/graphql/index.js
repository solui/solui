import { ApolloServer } from 'apollo-server-koa'

import schema from './schema'
import createResolvers from './resolvers'

export default ({ config, server: app, db, notifier, stripe }) => {
  const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers: createResolvers({ config, db, notifier, stripe }),
    context: ({ ctx: { session: { uid, isAdmin } } }) => ({ uid, isAdmin })
  })

  server.applyMiddleware({ app })
}
