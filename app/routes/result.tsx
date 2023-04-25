import type { LoaderArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Link, useLoaderData } from '@remix-run/react';
import { useState, useEffect, useRef } from 'react';

export const loader = async ({ request }: LoaderArgs) => {
  const message = new URL(request.url).searchParams.get('message');
  const isMessageInvalid =
    message === null || message.length < 5 || message.length > 30;

  if (isMessageInvalid) {
    return json({ message: '', error: 'message' });
  }

  return json({ message, error: null });
};

export default function Result() {
  const { message, error } = useLoaderData<typeof loader>();
  const [reactions, setReactions] = useState('');
  const isFetchStarted = useRef(false);
  const ctrl = useRef(new AbortController());
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (error || message.length === 0) {
      return;
    }

    if (isFetchStarted.current === true) {
      return;
    }

    isFetchStarted.current = true;

    fetchEventSource('/gpt', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal: ctrl.current.signal,
      onmessage: ({ data }) => {
        if (data === '[DONE]') {
          setIsDone(true);
          return;
        }

        const content = JSON.parse(data)?.choices?.[0]?.delta?.content;

        if (typeof content === 'string') {
          setReactions((prev) => prev + content);
        }
      },
      onerror: () => {
        setIsDone(true);
        setReactions('오류가 발생했습니다. 잠시 후 다시 시도하세요.');
      },
      openWhenHidden: true,
    });
  }, [error, message]);

  const handleCancelButtonClick = () => {
    ctrl.current.abort();
    setIsDone(true);
  };

  if (error) {
    return (
      <main className="max-w-lg min-h-screen h-full mx-auto py-32 text-center font-mono bg-neutral-50">
        <h1 className="font-semibold text-xl px-4">
          입력한 텍스트에 문제가 있어요!
        </h1>
        <h2 className="mt-16 text-gray-700 text-lg">
          "시험 끝나고 놀러가자"에 대한 결과를 보고 싶다면?👇
        </h2>
        <ul className="mt-5 px-4 sm:px-12 text-gray-600 text-left text-sm">
          <li className="mb-1">ISTJ: 그 전에 계획을 먼저 세워야지.</li>
          <li className="mb-1">ISTP: 그래, 놀러 갈까?</li>
          <li className="mb-1">ISFJ: 그래도 일정을 빨리 마치고 싶어.</li>
          <li className="mb-1">
            ISFP: 오늘은 날씨가 좋은데, 바다가 좋을 것 같아.
          </li>
          <li className="mb-1">
            INFJ: 어디 가면 좋을까 고민 중이었는데, 좋아!
          </li>
          <li className="mb-1">INFP: 놀러 가면서 새로운 경험도 해보고 싶어.</li>
          <li className="mb-1">
            INTJ: 놀러 가기 전에 먼저 시간을 관리해야겠어.
          </li>
          <li className="mb-1">
            INTP: 놀러 가면서 새로운 아이디어도 생각해보자.
          </li>
          <li className="mb-1">ESTJ: 놀러 가기 전에 일정을 먼저 정리해야지.</li>
          <li className="mb-1">ESTP: 그래, 놀러 갈까? 어디 가면 좋을까?</li>
          <li className="mb-1">ESFJ: 다 같이 놀러 가면서 친목도 다지자.</li>
          <li className="mb-1">ESFP: 와! 놀러 가는 거 어디 가면 좋을까?</li>
          <li className="mb-1">
            ENFJ: 다 같이 놀러 가면서 서로의 이야기도 들어보자.
          </li>
          <li className="mb-1">
            ENFP: 와! 놀러 가는 거 어디 가면 좋을까? 재밌겠다!
          </li>
          <li className="mb-1">ENTJ: 놀러 가기 전에 계획을 먼저 세워야겠어.</li>
          <li className="mb-1">
            ENTP: 놀러 가면서 새로운 아이디어도 생각해보자.
          </li>
        </ul>
        <Link
          to="/"
          className="block w-32 p-3 mt-10 mx-auto rounded bg-blue-500 text-white"
        >
          다시 해보기
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-lg min-h-screen h-full mx-auto py-16 text-center font-mono bg-neutral-50">
      <h1 className="font-semibold text-xl px-4">
        {isDone ? `"${message}"` : `"${message}"에 대한 답변 생성 중...`}
      </h1>
      {!isDone && (
        <button
          className="w-32 p-3 my-5 rounded bg-blue-500 text-white"
          onClick={handleCancelButtonClick}
        >
          취소
        </button>
      )}
      <ul
        className="h-full mt-5 px-4 sm:px-12 text-left text-sm"
        dangerouslySetInnerHTML={{
          __html: reactions
            .split('-')
            .map((v) => v.trim())
            .filter((v) => v.length)
            .map((v) => `<li style="margin-bottom:0.5rem">${v}</li>`)
            .join(''),
        }}
      />
      {isDone && (
        <>
          <Link
            to="/"
            className="block w-32 p-3 mt-10 mx-auto rounded bg-blue-500 text-white"
          >
            다시 해보기
          </Link>
          <p className="mt-12 px-4 text-gray-500 text-sm">
            답변이 실시간으로 생성되기 때문에 매번 달라질 수 있어요🙂
          </p>
        </>
      )}
    </main>
  );
}
