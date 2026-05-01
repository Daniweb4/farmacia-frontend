import { Spinner } from 'react-bootstrap';

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loading;