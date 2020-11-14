import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import utilStyles from '@/styles/utils.module.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import IndividualForm from '@/components/CustomAuthForms/IndividualForm';
import transForm from '@/components/CustomAuthForms/transForm';

const propTypes = {
  forms: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  submitFunction: PropTypes.func,
  context: PropTypes.oneOf(['login', 'signup', 'settings']),
  username: PropTypes.string,
  router: PropTypes.object
};

const CustomAuthForms = (props) => {
  const {
    forms,
    title,
    submitFunction,
    context,
    username,
    router
  } = props;

  const [ buttonState, setButtonState ] = useState({ disabled: false, text: 'Submit' });

  useEffect(() => {
    setButtonState({ ...buttonState, text: title });
  }, [title]);

  const { register, handleSubmit } = useForm();

  const revertStatus = () => setButtonState({ ...buttonState, text: title });

  const onSubmit = async (data) => {
    let req;
    const prevPath = router.query;
    setButtonState({ disabled: true, text: 'Sending...' });

    switch (context) {
      case 'login':
        req = await submitFunction(prevPath, data);
        break;
      case 'signup':
        req = await submitFunction(data);
        break;
      case 'settings':
        req = await submitFunction(username, data);
        break;
    }

    // Need to explicitly state that req exists for when signing up or logging in,
    // aka cases whose successful "return values" are just redirects
    if (req && !req.error) {
      setButtonState({ disabled: false, text: req.message });
    } else if (req && req.error) {
      setButtonState({ disabled: false, text: req.error });
    }
  };

  return (
    <>
      {/* Override form:focus color */}
      <style type="text/css">
        {`
        .form-control:focus {
          border-color: rgba(130, 25, 25, 0.3);
          box-shadow: 0 0 0 0.2rem rgba(130, 25, 25, 0.15);
        }
      `}
      </style>

      <div className={`w-75 mx-auto ${utilStyles.pd20}`}>
        <Form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
          {forms.map((form) => transForm(form)).map((formData) =>
            <IndividualForm key={formData.id} {...formData} title={title} register={register} />
          )}

          <Button onBlur={revertStatus} variant="dark" type="submit" block disabled={buttonState.disabled}>
            {buttonState.text}
          </Button>
        </Form>
      </div>
    </>
  );
};

CustomAuthForms.propTypes = propTypes;

export default withRouter(CustomAuthForms);
