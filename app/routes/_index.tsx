import { Form } from '@remix-run/react';

export default function Index() {
  return (
    <main className="max-w-lg min-h-screen mx-auto py-16 text-center font-mono bg-neutral-50">
      <h1 className="font-semibold text-4xl">MBTI별 반응보기😆</h1>
      <Form
        reloadDocument
        action="/result"
        autoComplete="off"
        spellCheck="false"
        className="flex mt-20"
      >
        <p className="flex-1 px-3">
          <input
            required
            minLength={5}
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
          입력
        </button>
      </Form>
      <p className="mt-5 text-gray-400">최소 5자, 최대 30자</p>
      <h2 className="mt-16 text-gray-600 text-lg">결과는 이렇게 나와요👇</h2>
      <ul className="mt-5 px-4 sm:px-12 text-gray-500 text-left text-sm">
        <li className="mb-1">ISTJ: 돈을 아끼세요.</li>
        <li className="mb-1">ISTP: 뭐 샀어?</li>
        <li className="mb-1">ISFJ: 쇼핑으로 기분 좋아졌어?</li>
        <li className="mb-1">ISFP: 나도 쇼핑가고 싶다.</li>
        <li className="mb-1">INFJ: 왜 기분이 안 좋았어?</li>
        <li className="mb-1">INFP: 나도 그래. 쇼핑은 최고야.</li>
        <li className="mb-1">INTJ: 쇼핑은 시간 낭비야.</li>
        <li className="mb-1">INTP: 돈이 얼마나 나갔어?</li>
        <li className="mb-1">ESTJ: 쇼핑하면서 뭐 샀어?</li>
        <li className="mb-1">ESTP: 나도 쇼핑가고 싶다. 같이 가자!</li>
        <li className="mb-1">ESFJ: 쇼핑하면서 뭐 샀어?</li>
        <li className="mb-1">ESFP: 쇼핑은 최고지! 뭐 샀어?</li>
        <li className="mb-1">ENFJ: 기분이 안 좋았으면 나랑 얘기해봐.</li>
        <li className="mb-1">ENFP: 나도 그래. 쇼핑은 기분을 좋게 해줘.</li>
        <li className="mb-1">ENTJ: 쇼핑은 시간 낭비야. 일해라.</li>
        <li className="mb-1">ENTP: 쇼핑하면서 뭐 샀어? 얼마나 샀어?</li>
      </ul>
      <p className="mt-12 px-4 text-gray-400 text-sm">
        <a className="text-gray-500 underline" href="https://chat.openai.com/">
          챗GPT
        </a>
        로 유명한 OpenAI를 사용하여 실시간으로 답변을 생성합니다.
      </p>
      <p className="mt-4 px-4 text-gray-400 text-sm">
        입력한 텍스트는 인공지능 학습에{' '}
        <a
          className="text-gray-500 underline"
          href="https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance"
        >
          사용되지 않으며
        </a>
        , 저장되지 않습니다.
      </p>
    </main>
  );
}
