import { Alert } from "react-bootstrap"

const Meassage = ({ variant, children}) => {
  return (
    <Alert variant={variant}>
        {children}
    </Alert>
  )
}

Meassage.defaultProps = {
    variant: 'info'
}

export default Meassage