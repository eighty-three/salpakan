import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

const propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  username: PropTypes.bool,
  title: PropTypes.string,
  register: PropTypes.func
};

const IndividualForm = (props) => {
  const {
    id,
    label,
    username,
    title,
    register
  } = props;

  return (
    <Form.Group controlId={`${title} ${id}`}>
      <Form.Label>{label}:</Form.Label>
      {username
        ? (
          <Form.Control 
            type="text"
            maxLength={30}
            pattern="[a-zA-Z0-9_]{1,29}"
            placeholder="[ a-z0-9_ ]{1,29}"
            spellCheck="false"
            aria-describedby={id}
            name={id}
            ref={register({ required: true })} 
          />
        ) : (
          <Form.Control 
            type="password"
            maxLength={200}
            placeholder="maxLength=200"
            aria-describedby={id}
            name={id}
            ref={register({ required: true })} 
          />
        )
      }
    </Form.Group>
  );
};

IndividualForm.propTypes = propTypes;

export default IndividualForm;
