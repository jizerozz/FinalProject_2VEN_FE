import React, { forwardRef, RefObject, useEffect, useState } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { GrMailOption } from 'react-icons/gr';
import { IoIosCloseCircle, IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { RiKeyFill } from 'react-icons/ri';

import BaseInput from '@/components/common/BaseInput';
import theme from '@/styles/theme';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  width?: string | number;
  status?: InputStatus;
  leftIcon?: 'mail' | 'key';
  rightIcon?: 'eye' | 'clear';
  showClearButton?: boolean;
  isDisabled?: boolean;
  ref?: RefObject<HTMLInputElement>;
  customStyle?: SerializedStyles;
  validate?: (value: string) => { isValid: boolean; message: string };
  onInputValidation?: (isValid: boolean) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    inputSize = 'md',
    width = 'auto',
    status = 'default',
    leftIcon,
    rightIcon,
    showClearButton = false,
    isDisabled = false,
    customStyle,
    validate,
    onInputValidation,
    ...inputProps
  } = props;

  // UI 상태만 관리
  const [inputStatus, setInputStatus] = useState<InputStatus>(status);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const inputValue = (props.value as string) || '';

  // 아이콘 매핑
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return <GrMailOption />;
      case 'key':
        return <RiKeyFill />;
      case 'eye':
        return showPassword ? <IoMdEyeOff /> : <IoMdEye />;
      case 'clear':
        return <IoIosCloseCircle />;
      default:
        return null;
    }
  };

  // status prop 변경 시 동기화
  useEffect(() => {
    setInputStatus(status);
  }, [status]);

  // validation 로직 (선택적)
  useEffect(() => {
    if (validate && inputValue) {
      const validationResult = validate(inputValue);
      setInputStatus(validationResult.isValid ? 'success' : 'error');
      onInputValidation?.(validationResult.isValid);
    }
  }, [inputValue, validate, onInputValidation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputProps.onChange?.(e);
  };

  const handleClear = () => {
    setInputStatus('default');
    if (inputProps.onChange) {
      const event = new Event('input', {
        bubbles: true,
      }) as unknown as React.ChangeEvent<HTMLInputElement>;
      Object.defineProperty(event, 'target', { value: { value: '' } });
      inputProps.onChange(event);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // padding 스타일 계산
  const dynamicPaddingStyles = css`
    ${leftIcon && 'padding-left: 36px;'}
    ${(rightIcon || (showClearButton && inputValue)) && 'padding-right: 36px;'}
  `;

  return (
    <div css={containerStyles} style={{ width: typeof width === 'number' ? `${width}px` : width }}>
      <div css={[wrapperStyles, iconSpacingStyles[inputSize]]}>
        {leftIcon && <div css={leftIconStyles}>{getIcon(leftIcon)}</div>}

        <BaseInput
          {...inputProps}
          ref={ref}
          type={
            inputProps.type === 'password' ? (showPassword ? 'text' : 'password') : inputProps.type
          }
          value={inputValue}
          disabled={isDisabled}
          inputSize={inputSize}
          status={inputStatus}
          onChange={handleInputChange}
          customStyle={css`
            ${dynamicPaddingStyles}
            ${customStyle}
          `}
        />

        {showClearButton && inputValue && inputStatus !== 'success' && (
          <button type='button' onClick={handleClear} css={rightIconStyles}>
            {getIcon('clear')}
          </button>
        )}

        {rightIcon === 'eye' && (
          <button type='button' onClick={handleTogglePassword} css={rightIconStyles}>
            {getIcon('eye')}
          </button>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

const containerStyles = css`
  display: block;
  position: relative;
`;

const wrapperStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const iconSpacingStyles = {
  sm: css`
    svg {
      color: ${theme.colors.gray[400]};
      width: 20px;
      height: 20px;
    }
  `,
  md: css`
    svg {
      color: ${theme.colors.gray[400]};
      width: 24px;
      height: 24px;
    }
  `,
  lg: css`
    svg {
      color: ${theme.colors.gray[400]};
      width: 24px;
      height: 24px;
    }
  `,
};

const iconButtonStyles = css`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: ${theme.colors.gray[500]};

  &:hover {
    color: ${theme.colors.gray[700]};
  }
`;

const leftIconStyles = css`
  ${iconButtonStyles}
  left: 12px;
`;

const rightIconStyles = css`
  ${iconButtonStyles}
  right: 12px;
`;

export default Input;
