import { css } from '@emotion/react';
import { Meta, StoryObj } from '@storybook/react';

import Button from '@/components/common/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'secondaryGray', 'neutral', 'accent', 'ghostGray'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    isFullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    width: { control: 'text' },
    children: { control: 'text' },
    customStyle: { table: { disable: true } },
    type: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    isFullWidth: true,
    children: '+ button',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const finalArgs = {
      ...args,
      width: args.isFullWidth ? undefined : (args.width ?? 200),
    };

    return (
      <div css={wrapper}>
        <Button {...finalArgs} />
      </div>
    );
  },
};

const wrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  padding: 0 2rem;
  max-width: 600px;
  margin: 0 auto;
`;
