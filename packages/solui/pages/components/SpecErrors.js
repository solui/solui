export default ({ errors }) => (
  <div>
    <strong>ERORR!</strong>
    {errors.map(error => (
      <p key={error.toString()}>{error}</p>
    ))}
  </div>
)
