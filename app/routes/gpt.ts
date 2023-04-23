import type { ActionArgs } from '@remix-run/node';
import { PROMPT } from '~/config';

export async function action({ request }: ActionArgs) {
  const data = await request.json();

  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: data.message },
      ],
      temperature: 0,
      stream: true,
    }),
  });
}

// TODO: 배포, 탭 전환하면 똑같은거 다시 오는 거...?????????
