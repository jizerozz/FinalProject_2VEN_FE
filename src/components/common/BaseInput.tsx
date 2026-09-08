import { forwardRef, InputHTMLAttributes } from 'react';

import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  status?: InputStatus;
  customStyle?: SerializedStyles;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ inputSize = 'md', status = 'default', customStyle, ...props }, ref) => {
    const currentInputStyles = [
      baseInputStyles,
      inputSizeStyles[inputSize],
      inputStatusStyles[status],
      customStyle,
    ];

    return <input ref={ref} {...props} css={currentInputStyles} />;
  }
);

BaseInput.displayName = 'BaseInput';

export default BaseInput;

const baseInputStyles = css`
  display: block;
  width: 100%;
  border: 1px solid ${theme.colors.gray[300]};
  background-color: ${theme.colors.main.white};
  outline: none;
  transition: all 0.2s ease;
  line-height: 150%;

  &::placeholder {
    color: ${theme.colors.gray[700] + '4a'};
    font-weight: ${theme.typography.fontWeight.regular};
  }

  &:hover:not(:disabled) {
    border-color: ${theme.colors.main.primary};
  }

  &:focus:not(:disabled) {
    border-color: ${theme.colors.main.primary};
  }

  &:disabled {
    background-color: ${theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const inputSizeStyles = {
  sm: css`
    height: ${theme.input.height.sm};
    padding: ${theme.input.padding.sm};
    font-size: ${theme.input.fontSize.sm};
  `,
  md: css`
    height: ${theme.input.height.md};
    padding: ${theme.input.padding.md};
    font-size: ${theme.input.fontSize.md};
  `,
  lg: css`
    height: ${theme.input.height.lg};
    padding: ${theme.input.padding.lg};
    font-size: ${theme.input.fontSize.lg};
  `,
};

const inputStatusStyles = {
  default: css``,
  error: css`
    border-color: ${theme.colors.main.alert};

    &:hover:not(:disabled) {
      border-color: ${theme.colors.main.alert};
    }

    &:focus:not(:disabled) {
      border-color: ${theme.colors.main.alert};
    }
  `,
  success: css`
    border-color: ${theme.colors.gray[400]};
  `,
};
