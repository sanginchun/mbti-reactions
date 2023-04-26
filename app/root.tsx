import type { LinksFunction, V2_MetaFunction } from '@vercel/remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useEffect } from 'react';
import tailwindCss from '~/tailwind.css';
import { Analytics } from '@vercel/analytics/react';

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: 'MBTI별 반응😆',
    },
    {
      name: 'description',
      content: '~라고 했을 때 MBTI별 반응보기ㅋㅋ',
    },
    {
      property: 'og:title',
      content: 'MBTI별 반응😆',
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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.getElementsByTagName('body')[0];

      if (body) {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', '//t1.daumcdn.net/kas/static/ba.min.js');
        script.setAttribute('async', '');

        body.appendChild(script);
      }
    }
  }, []);
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
