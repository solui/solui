export default ({ error }) => {
  if (!Array.isArray(error)) {
    error = [ error ]
  }

  return (
    <div>
      {error.map(e => (
        <div key={e.toString()}>
          <p>{e.toString()}</p>
          {e.details ? e.details.map(d => (
            <p key={d.toString()}>- {d.toString()}</p>
          )) : null}
        </div>
      ))}
    </div>
  )
}
