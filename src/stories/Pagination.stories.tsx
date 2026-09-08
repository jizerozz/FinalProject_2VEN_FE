import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import Pagination from '@/components/common/Pagination';

type Story = StoryObj<{ totalPage: number; limit: number }>;

const meta: Meta<typeof Pagination> = {
  title: 'Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  argTypes: {
    totalPage: {
      control: { type: 'number' },
      defaultValue: 10,
    },
    limit: {
      control: { type: 'number' },
      defaultValue: 5,
    },
  },
};

export default meta;

const PaginationStory = ({ totalPage, limit }: { totalPage: number; limit: number }) => {
  const [page, setPage] = useState(1);

  return (
    <div>
      <Pagination totalPage={totalPage} page={page} setPage={setPage} limit={limit} />
    </div>
  );
};

export const Default: Story = {
  args: {
    totalPage: 10,
    limit: 5,
  },
  render: (args) => <PaginationStory {...args} />,
};
