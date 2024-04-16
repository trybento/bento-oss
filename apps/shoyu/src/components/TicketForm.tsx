import React, { useState, useCallback, useEffect } from 'react';
import cx from 'classnames';

import TextInput, { TextInputAs } from 'bento-common/components/TextInput';
import composeComponent from 'bento-common/hocs/composeComponent';
import createTicket from '../stores/mainStore/mutators/createTicket';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { UIStateContextValue } from '../providers/UIStateProvider';
import withUIState from '../hocs/withUIState';
import { getBentoSettings } from '../lib/helpers';

type OuterProps = {};

type CustomUIData = Pick<CustomUIProviderValue, 'primaryColorHex'>;
type UIStateData = Pick<UIStateContextValue, 'uiActions'>;

const REDIRECT_WAIT = 3000;

enum SubmitState {
  none = 'none',
  loading = 'loading',
  done = 'done',
}

export const TicketForm: React.FC<OuterProps & UIStateData & CustomUIData> = ({
  primaryColorHex,
  uiActions,
}) => {
  const [submitted, setSubmitted] = useState(SubmitState.none);
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');

  const setInput = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) => (val: string) => {
      setter(val);
    },
    []
  );

  const disabled =
    !body || !subject || !name || !email || submitted === SubmitState.loading;

  const handleSubmit = useCallback(async () => {
    setSubmitted(SubmitState.loading);

    await createTicket({
      subject,
      body,
      name,
      email,
    });

    setSubmitted(SubmitState.done);

    setTimeout(() => {
      uiActions.handleShowActiveGuides();
    }, REDIRECT_WAIT);
  }, [subject, body, name, email]);

  useEffect(() => {
    /* Pre-populate info if we know it */
    const bentoSettings = getBentoSettings();

    if (bentoSettings?.accountUser.fullName)
      setName(bentoSettings.accountUser.fullName);
    if (bentoSettings?.accountUser.email)
      setEmail(bentoSettings?.accountUser.email);
  }, []);

  return submitted === SubmitState.done ? (
    <div
      className="w-full h-full flex-col flex justify-center align-center"
      style={{
        alignItems: 'center',
        minHeight: '20em',
        textAlign: 'center',
      }}
    >
      <div className="font-semibold mb-4">📨 Thanks for reaching out</div>
      <div>
        We appreciate your feedback and will respond as quickly as possible.
      </div>
    </div>
  ) : (
    <div
      className={cx('flex gap-4 flex-col justify-between items-center py-3')}
    >
      <TextInput
        label="Your name"
        defaultValue={name}
        placeholder="John Doe"
        onChange={setInput(setName)}
        required={true}
        as={TextInputAs.input}
        inputClassName="rounded-lg"
      />
      <TextInput
        label="Email"
        defaultValue={email}
        placeholder="johndoe@acme.co"
        onChange={setInput(setEmail)}
        required={true}
        as={TextInputAs.input}
        inputClassName="rounded-lg"
      />
      <TextInput
        label="Subject"
        defaultValue={subject}
        placeholder="Assistance needed for..."
        onChange={setInput(setSubject)}
        required={true}
        as={TextInputAs.input}
        inputClassName="rounded-lg"
      />
      <TextInput
        label="How can we help?"
        defaultValue={body}
        placeholder="I'm trying to..."
        onChange={setInput(setBody)}
        required={true}
        as={TextInputAs.textarea}
        inputClassName="rounded-lg"
        style={{
          minHeight: '160px',
        }}
      />
      <div className="w-full flex justify-end">
        <button
          className={cx(
            'relative',
            'rounded',
            'whitespace-nowrap',
            'px-4',
            'py-2',
            'font-semibold',
            'text-base',
            'transition',
            'text-white',
            {
              'opacity-60 cursor-not-allowed': disabled,
              'hover:opacity-80 cursor-pointer': !disabled,
            }
          )}
          style={{ backgroundColor: primaryColorHex }}
          disabled={disabled}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([withCustomUIContext, withUIState])(
  TicketForm
);
