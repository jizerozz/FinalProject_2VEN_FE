import { forwardRef, InputHTMLAttributes } from 'react';

import { SerializedStyles } from '@emotion/react';

import BaseInput from '@/components/common/BaseInput';

export type InputStatus = 'default' | 'error' | 'success';

interface ProfileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  isDisabled?: boolean;
  customStyle?: SerializedStyles;
  status?: InputStatus;
}

const ProfileInput = forwardRef<HTMLInputElement, ProfileInputProps>(
  (
    { onChange, value, isDisabled = false, customStyle, status = 'default', ...inputProps },
    ref
  ) => (
    <BaseInput
      {...inputProps}
      ref={ref}
      type='text'
      value={value}
      disabled={isDisabled}
      inputSize='md'
      status={status}
      onChange={onChange}
      customStyle={customStyle}
    />
  )
);

ProfileInput.displayName = 'ProfileInput';

export default ProfileInput;
