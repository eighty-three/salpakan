import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import styles from './index.module.scss';
import buttonStyle from '@/styles/Buttons.module.scss';
import IndividualForm from '@/components/CustomAuthForms/IndividualForm';
import transForm from '@/components/CustomAuthForms/transForm';

import useButton from '@/hooks/useButton';

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

  const [buttonState, setButtonState] = useButton('Submit');
  const { register, handleSubmit } = useForm();
  const revertText = () => setButtonState({ ...buttonState, text: 'Submit' });

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

    /* Need to explicitly state that req exists for when signing up or logging in,
     * aka cases whose successful "return values" are just redirects
     */
    if (req && !req.error) {
      setButtonState({ disabled: false, text: req.message });
    } else if (req && req.error) {
      setButtonState({ disabled: false, text: req.error });
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <p className={styles.title}>{title}</p>
      <div className={styles.formGroups}>
        {forms.map((form) => transForm(form)).map((formData) =>
          <IndividualForm key={formData.id} {...formData} context={context} register={register} />
        )}
      </div>

      <button
        onBlur={revertText}
        type={'submit'}
        className={`${buttonStyle.button} ${buttonStyle.long}`}
        disabled={buttonState.disabled}
      >
        {buttonState.text}
      </button>
    </form>
  );
};

CustomAuthForms.propTypes = propTypes;

export default withRouter(CustomAuthForms);
