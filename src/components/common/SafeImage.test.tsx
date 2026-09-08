// @vitest-environment jsdom
import { act, ReactNode } from 'react';

import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Avatar from '@/components/common/Avatar';
import SafeImage from '@/components/common/SafeImage';
import StrategyIcon from '@/components/common/StrategyIcon';
import ImgSection from '@/components/page/strategy-detail/ImgSection';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.style.overflow = '';
});

const render = (node: ReactNode) => act(() => root.render(node));
const image = () => {
  const element = container.querySelector('img');
  if (!element) throw new Error('Expected an image');
  return element;
};
const dispatch = (element: Element, event: string) =>
  act(() => element.dispatchEvent(new Event(event, { bubbles: true })));

describe('image failure recovery', () => {
  it('keeps successful images and forwards load events', () => {
    const onLoad = vi.fn();
    render(<SafeImage src='/photo.png' alt='프로필' onLoad={onLoad} />);
    dispatch(image(), 'load');
    expect(image().getAttribute('src')).toBe('/photo.png');
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it('uses a local avatar on remote failure and stops after fallback failure', () => {
    render(<Avatar src='https://unavailable.invalid/avatar.png' alt='프로필' />);
    dispatch(image(), 'error');
    expect(image().getAttribute('src')).toContain('default_avatar.png');
    dispatch(image(), 'error');
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toContain('프로필');
  });

  it.each([undefined, null, '', '   '])('handles missing source %s', (src) => {
    render(<SafeImage src={src} alt='첨부 이미지' width={225} height={163} />);
    expect(container.querySelector('img')).toBeNull();
    const placeholder = container.querySelector<HTMLElement>('[role="img"]');
    expect(placeholder?.textContent).toContain('이미지를 일시적으로');
    expect(placeholder?.style.width).toBe('225px');
    expect(placeholder?.style.height).toBe('163px');
  });

  it('retries when the URL changes, including returning to an earlier URL', () => {
    render(<SafeImage src='/a.png' alt='첨부' />);
    dispatch(image(), 'error');
    render(<SafeImage src='/b.png' alt='첨부' />);
    expect(image().getAttribute('src')).toBe('/b.png');
    dispatch(image(), 'error');
    render(<SafeImage src='/a.png' alt='첨부' />);
    expect(image().getAttribute('src')).toBe('/a.png');
  });

  it('clears the original srcSet when switching to fallback', () => {
    render(
      <SafeImage src='/a.png' srcSet='/a-2x.png 2x' fallbackSrc='/fallback.png' alt='프로필' />
    );
    dispatch(image(), 'error');
    expect(image().getAttribute('src')).toBe('/fallback.png');
    expect(image().hasAttribute('srcset')).toBe(false);
  });

  it('maps exact known icon filenames but preserves opaque URLs', () => {
    render(
      <StrategyIcon
        src='https://unavailable.invalid/icons/producttype_stock.png?token=x'
        alt='주식'
      />
    );
    expect(image().getAttribute('src')).not.toContain('unavailable.invalid');
    render(<StrategyIcon src='https://unavailable.invalid/icons/opaque-id.png' alt='종목' />);
    expect(image().getAttribute('src')).toContain('opaque-id.png');
    dispatch(image(), 'error');
    expect(container.querySelector('[role="img"]')?.textContent).toBe('—');
  });

  it('uses local badges by product name even with missing or opaque URLs', () => {
    render(
      <StrategyIcon src='https://unavailable.invalid/opaque.png' label='국내 주식' alt='국내주식' />
    );
    expect(image().getAttribute('src')).toContain('domestic-stock-small.svg');
    render(<StrategyIcon label='해외 ETF' alt='해외 ETF' />);
    expect(image().getAttribute('src')).toContain('overseas-etf-small.svg');
    render(<StrategyIcon label='p' alt='P' />);
    expect(image().getAttribute('src')).toContain('trade-p-small.svg');
  });

  it.each([
    ['92d70f53-1d29-4704-a21c-6d8be8f85bc0', 'trade-a'],
    ['d3bd6274-2be5-4efe-8ec1-6736979821e6', 'trade-h'],
    ['701a31eb-5c79-4d9d-b1f2-a3ed2e18d179', 'trade-manual'],
    ['1ec1159d-4494-450f-ae75-43f4e3674e98', 'cycle-day'],
    ['46ba0897-bc11-495d-bffc-0af048073d83', 'cycle-position'],
  ])('resolves actual API icon %s before an S3 request or error', (id, badge) => {
    render(
      <StrategyIcon
        src={`https://fastcampus-team2.s3.ap-northeast-2.amazonaws.com/admin/icon/${id}.png?version=1`}
        alt='전략 유형'
      />
    );
    expect(image().getAttribute('src')).toContain(`${badge}-small.svg`);
    expect(image().getAttribute('src')).not.toContain('amazonaws.com');
  });

  it('renders the reported strategy as automatic and day using API names', () => {
    render(
      <>
        <StrategyIcon src='/unknown-type.png' label='자동' alt='자동' />
        <StrategyIcon src='/unknown-cycle.png' label='데이' alt='데이' />
      </>
    );
    const sources = Array.from(container.querySelectorAll('img'), (img) => img.getAttribute('src'));
    expect(sources[0]).toContain('trade-a-small.svg');
    expect(sources[1]).toContain('cycle-day-small.svg');
    expect(container.querySelector('[role="img"]')).toBeNull();
  });

  it('does not guess unknown category names', () => {
    render(<StrategyIcon src='/opaque.png' label='미확인 유형' alt='유형' />);
    expect(image().getAttribute('src')).toBe('/opaque.png');
  });

  it('disables expansion until loaded, closes on source change, and restores scroll on unmount', () => {
    const section = (src: string) => (
      <ImgSection img={src} name='계좌' id={1} isSelected={false} onSelect={() => {}} />
    );
    render(section('/a.png'));
    expect(container.querySelector('button')?.disabled).toBe(true);
    dispatch(image(), 'error');
    expect(container.querySelector('button')?.disabled).toBe(true);
    render(section('/b.png'));
    dispatch(image(), 'load');
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(false);
    document.body.style.overflow = 'scroll';
    act(() => button?.click());
    expect(document.body.style.overflow).toBe('hidden');
    render(section('/c.png'));
    expect(document.body.style.overflow).toBe('scroll');
    expect(container.querySelector('button')?.disabled).toBe(true);
    dispatch(image(), 'load');
    act(() => container.querySelector('button')?.click());
    expect(document.body.style.overflow).toBe('hidden');
    render(null);
    expect(document.body.style.overflow).toBe('scroll');
  });
});
