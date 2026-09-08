import { forwardRef } from 'react';

import { css, SerializedStyles } from '@emotion/react';

import Input, { InputProps } from '@/components/common/Input';
import theme from '@/styles/theme';

export interface TextFieldProps extends InputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  labelStyle?: SerializedStyles;
  containerStyle?: SerializedStyles;
  labelPosition?: 'top' | 'left';
  labelWidth?: number | string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      required = false,
      labelStyle,
      containerStyle,
      labelPosition = 'top',
      labelWidth = 109,
      ...inputProps
    },
    ref
  ) => {
    const hasError = Boolean(errorMessage);
    const hasSuccess = Boolean(helperText && !hasError);
    const computedStatus = inputProps.status
      ? inputProps.status
      : hasError
        ? 'error'
        : hasSuccess
          ? 'success'
          : 'default';
    const isHorizontal = labelPosition === 'left';

    const inputWrapperStyles = isHorizontal ? inputWrapperHorizontalStyles : undefined;
    const containerStyles = isHorizontal
      ? [fieldContainerHorizontalStyles, containerStyle]
      : [fieldContainerStyles, containerStyle];

    return (
      <div css={containerStyles}>
        {label && (
          <label
            htmlFor={inputProps.id}
            css={[
              isHorizontal ? labelHorizontalStyles : labelStyles,
              labelStyle,
              isHorizontal &&
                css`
                  width: ${typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth};
                `,
            ]}
          >
            {label}
            {required && <span css={requiredMarkerStyles}>*</span>}
          </label>
        )}

        <div css={inputWrapperStyles}>
          <Input {...inputProps} ref={ref} status={computedStatus} />

          {(errorMessage || helperText) && (
            <p
              css={[
                messageStyles,
                hasError && errorMessageStyles,
                helperText && !hasError && successMessageStyles,
              ]}
            >
              {errorMessage || helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextField.displayName = 'TextField';

const fieldContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const fieldContainerHorizontalStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const inputWrapperHorizontalStyles = css`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const labelStyles = css`
  font-size: ${theme.typography.fontSizes.body};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[900]};
  line-height: ${theme.typography.lineHeights.lg};
`;

const labelHorizontalStyles = css`
  font-size: ${theme.typography.fontSizes.caption};
  font-weight: ${theme.typography.fontWeight.regular};
  color: ${theme.colors.gray[900]};
  line-height: ${theme.typography.lineHeights.lg};
  text-align: left;
`;

const requiredMarkerStyles = css`
  color: ${theme.colors.main.alert};
  margin-left: 4px;
`;

const messageStyles = css`
  position: absolute;
  left: 0;
  bottom: -20px;
  font-size: ${theme.typography.fontSizes.caption};
  line-height: ${theme.typography.lineHeights.sm};
  color: ${theme.colors.main.alert};
  margin: 0;
  text-indent: 5px;
`;

const errorMessageStyles = css`
  color: ${theme.colors.main.alert};
`;

const successMessageStyles = css`
  color: ${theme.colors.main.primary};
`;

export default TextField;
