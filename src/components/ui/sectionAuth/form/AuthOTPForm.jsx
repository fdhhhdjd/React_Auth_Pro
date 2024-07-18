import React from 'react';

import Button from '@/components/common/buttons/Button';
import FormSubmit from '@/components/common/forms/FormSubmit';
import OTPInput from '@/components/common/inputs/OTPInput';
import ConditionalLink from '@/components/common/links/ConditionalLink';
import LoadingSpinner from '@/components/common/loadings/LoadingSpinner';
import Paragraph from '@/components/common/paragraph/Paragraph';
import useAppSelector from '@/hooks/useAppSelector';

import { RoutePaths } from '@/configs';
import { TIME_CONSTANTS } from '@/constants';
import { cn } from '@/helpers';
import { formatTime } from '@/utils';

const AuthOTPForm = () => {
  const { isLoading } = useAppSelector(state => state.auth);

  const [code, setCode] = React.useState();
  const [countdown, setCountdown] = React.useState(
    TIME_CONSTANTS._15_MINUTES / 1000
  );

  const handleSubmit = e => {
    e.preventDefault();
    setCountdown(TIME_CONSTANTS._15_MINUTES / 1000);
  };

  React.useEffect(() => {
    if (code) {
      console.info(code, 'OK');
    }
    return () => setCode();
  }, [code]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(currentTime => {
        if (currentTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <React.Fragment>
      <FormSubmit className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
        <Paragraph className='text-gray-600 text-center mb-4'>
          Code sent to: <b className='text-orange-400'>+8479880541</b>
        </Paragraph>
        <OTPInput length={6} onComplete={otp => setCode(otp)} />
        {isLoading && <LoadingSpinner />}

        <div className='flex items-center justify-between'>
          <Button className='px-3 py-2 text-sm font-medium text-center rounded text-gray-500 hover:text-orange-500'>
            Resend Code
          </Button>
          <Button className='px-3 py-2 text-sm font-medium text-center rounded text-gray-500 hover:text-blue-500'>
            Request Again:&nbsp;
            <b
              className={cn(
                countdown <= TIME_CONSTANTS._1_MINUTES / 1000
                  ? 'text-red-400'
                  : 'text-orange-400'
              )}
            >
              {formatTime(countdown)}
            </b>
          </Button>
        </div>

        <Paragraph className='text-sm font-light text-gray-500'>
          Do you already have an account ? &nbsp;
          <ConditionalLink
            className='font-medium text-orange-500 hover:underline'
            to={RoutePaths.AUTH.SIGN_IN}
          >
            Sign In
          </ConditionalLink>
        </Paragraph>
      </FormSubmit>
    </React.Fragment>
  );
};

export default AuthOTPForm;
