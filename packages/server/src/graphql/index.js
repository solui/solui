import { ApolloServer } from 'apollo-server-koa'
import { schema } from '@solui/graphql'

import createResolvers from './resolvers'

export default ({ config, server: app, db, notifier, stripe }) => {
  const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers: createResolvers({ config, db, notifier, stripe }),
    context: ({ ctx: { state: { uid, isAdmin } } }) => ({ uid, isAdmin })
  })

  server.applyMiddleware({
    app,
    path: '/q'
  })
}
