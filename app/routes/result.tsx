import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Link, useActionData, useNavigate } from '@remix-run/react';
import { useState, useEffect, useRef } from 'react';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const message = (formData.get('message') as string) || '';

  return json({ message });
};

export default function Result() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [reactions, setReactions] = useState('');
  const isFetchStarted = useRef(false);
  const ctrl = useRef(new AbortController());
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (actionData?.message === undefined || actionData.message.length === 0) {
      navigate('/');
      return;
    }

    if (isFetchStarted.current === true) {
      return;
    }

    isFetchStarted.current = true;

    fetchEventSource('/gpt', {
      method: 'POST',
      body: JSON.stringify({ message: actionData.message }),
      signal: ctrl.current.signal,
      onmessage: ({ data }) => {
        if (data === '[DONE]') {
          setIsDone(true);
          return;
        }

        const message = JSON.parse(data)?.choices?.[0]?.delta?.content;

        if (typeof message === 'string') {
          setReactions((prev) => prev + message);
        }
      },
      onerror: () => {
        setIsDone(true);
        setReactions('오류가 발생했습니다. 잠시 후 다시 시도하세요.');
      },
      openWhenHidden: true,
    });
  }, [actionData?.message, navigate]);

  const handleCancelButtonClick = () => {
    ctrl.current.abort();
    setIsDone(true);
  };

  if (actionData === undefined) {
    return null;
  }

  return (
    <main className="max-w-lg min-h-screen h-full mx-auto py-16 text-center font-mono bg-neutral-50">
      <h1 className="font-semibold text-xl px-4">
        {isDone
          ? `"${actionData?.message}"`
          : `"${actionData?.message}"에 대한 답변 생성 중...`}
      </h1>
      {!isDone && (
        <button
          className="w-32 p-3 my-5 rounded bg-sky-500 text-white"
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
            .map((v) => `<li style="margin-bottom:0.7rem">${v}</li>`)
            .join(''),
        }}
      />
      {isDone && (
        <Link
          to="/"
          className="block w-32 p-3 mt-10 mx-auto rounded bg-sky-500 text-white"
        >
          다시 해보기
        </Link>
      )}
    </main>
  );
}
