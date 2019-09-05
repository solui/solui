export const _buildUserJoin = (qry, userIdColumn, options = {}) => {
  qry = qry.column({
    uId: 'user.id',
    uEmail: 'user.email',
  })

  if (options.leftJoin) {
    qry = qry.leftJoin('user', userIdColumn, 'user.id')
  } else {
    qry = qry.innerJoin('user', userIdColumn, 'user.id')
  }

  return qry
}

export const _extractUniqueUsers = rows => {
  return Object.values(
    rows.reduce((m, row) => {
      if (row.uId) {
        const id = row.uId

        // not yet seen
        if (!m[id]) {
          m[id] = row
        }
      }

      return m
    }, {})
  )
}
