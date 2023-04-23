import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useActionData } from '@remix-run/react';
import { useState, useEffect, useRef } from 'react';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const message = (formData.get('message') as string) || '';

  return json({ message });
};

export default function Result() {
  const actionData = useActionData<typeof action>();
  const [reactions, setReactions] = useState('');
  const isFetching = useRef(false);

  useEffect(() => {
    if (actionData?.message === undefined || actionData.message.length === 0) {
      return;
    }

    if (isFetching.current === true) {
      return;
    }

    isFetching.current = true;

    const ctrl = new AbortController();

    fetchEventSource('/gpt', {
      method: 'POST',
      body: JSON.stringify({ message: actionData.message }),
      signal: ctrl.signal,
      onmessage: ({ data }) => {
        if (data === '[DONE]') {
          return;
        }

        const message = JSON.parse(data)?.choices?.[0]?.delta?.content;

        if (typeof message === 'string') {
          setReactions((prev) => prev + message);
        }
      },
    });
  }, [actionData?.message]);

  return (
    <main className="max-w-lg min-h-screen h-max mx-auto py-16 text-center font-mono bg-neutral-50">
      <h1 className="font-semibold text-xl px-4">
        "{actionData?.message || ''}"
      </h1>
      <ul
        className="mt-5 px-4 sm:px-12 text-left text-sm"
        dangerouslySetInnerHTML={{
          __html: reactions
            .split('-')
            .map((v) => v.trim())
            .filter((v) => v.length)
            .map((v) => `<li style="margin-bottom:0.7rem">${v}</li>`)
            .join(''),
        }}
      />
    </main>
  );
}

/* <div
        className={`flex flex-col items-center w-full h-full absolute top-0 left-0 backdrop-blur ${
          isSubmitting ? 'block' : 'hidden'
        }`}
      >
        <svg
          className="animate-spin mt-52 h-12 w-12 text-sky-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-10 font-bold text-gray-700 text-xl text-center">
          답변을 생성 중입니다.. <br />
          <br />
          시간이 소요됩니다.
        </p>
      </div> */
