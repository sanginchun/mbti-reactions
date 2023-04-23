import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { PROMPT } from '~/config';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const message = (formData.get('message') as string) || '';

  const data = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: message },
      ],
      temperature: 0,
    }),
  });

  const result = await data.json();
  const aiMessage = (result?.choices?.[0]?.message?.content as string) || '';

  return json({ message, aiMessage });
};

export default function Result() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="max-w-lg h-screen mx-auto py-32 text-center font-mono bg-neutral-50">
      <h1 className="font-semibold text-xl">
        "{actionData?.message || ''}" 라고 했을 때...
      </h1>
      <p>{actionData?.aiMessage}</p>
    </main>
  );
}
