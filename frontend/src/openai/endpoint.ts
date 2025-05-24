export const openaiHost = 'https://toai-texj.onrender.com:3030';
// export const openaiHost = 'http://localhost:3030';

export const callOpenAI = async (content: any) => {
  try {
    const response = await fetch(openaiHost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || 'An error occurred';
      console.log(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OpenAI API error:', error);
  }
};
