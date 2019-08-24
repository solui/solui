export default ({ error }) => {
  if (!Array.isArray(error)) {
    error = [ error ]
  }

  return (
    <div>
      {error.map(e => (
        <p key={e.toString()}>{e.toString()}</p>
      ))}
    </div>
  )
}
