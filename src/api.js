// src/api.js
import axios from 'axios';

const API_KEY = 'YOUR_API_KEY'; // Replace with your API key

export const getFeedbackFromAI = async (prompt, response) => {
    try {
        const result = await axios.post(
            'https://api.openai.com/v1/completions', // OpenAI endpoint
            {
                model: 'text-davinci-003', // or another model
                prompt: `Evaluate this response: "${response}" for the prompt: "${prompt}". Is it correct? Provide feedback.`,
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error fetching feedback from AI:', error);
        return 'Error retrieving feedback.';
    }
};
