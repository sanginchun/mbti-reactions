import type { V2_MetaFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'MBTI별 반응😆' }];
};

export default function Index() {
  return (
    <main className="max-w-lg h-screen mx-auto py-32 text-center font-mono bg-neutral-50">
      <h1 className="font-semibold text-4xl">MBTI별 반응😆</h1>
      <Form
        reloadDocument
        method="post"
        action="/result"
        autoComplete="off"
        spellCheck="false"
        className="flex mt-20"
      >
        <p className="flex-1 px-3">
          <input
            required
            maxLength={30}
            placeholder="예) 오늘 기분이 별로여서 쇼핑했어"
            type="text"
            name="message"
            className="w-full h-12 px-3 py-2 border rounded border-gray-200 caret-gray-500 placeholder:text-gray-300"
          />
        </p>
        <button
          type="submit"
          className="w-14 mr-2 border border-transparent rounded bg-sky-500 text-white"
        >
          전송
        </button>
      </Form>
      <p className="mt-10 text-gray-400">최대 30자까지 입력할 수 있음</p>
    </main>
  );
}
