import type { LinksFunction, V2_MetaFunction } from '@vercel/remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import tailwindCss from '~/tailwind.css';
import { Analytics } from '@vercel/analytics/react';

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: 'MBTI별 반응😆',
    },
    {
      property: 'og:title',
      content: 'MBTI별 반응😆',
    },
    {
      property: 'description',
      content: '~라고 했을 때 MBTI별 반응보기ㅋㅋ',
    },
    {
      property: 'og:description',
      content: '~라고 했을 때 MBTI별 반응보기ㅋㅋ',
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindCss },
];

export default function App() {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
