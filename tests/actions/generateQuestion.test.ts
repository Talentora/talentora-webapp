import { generateQuestion } from '@/app/(api)/actions/generateQuestion';
import { generateText } from 'ai';

// Mock the ai module
jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

describe('generateQuestion', () => {
  it('should return the generated text', async () => {
    // Mock the response from generateText
    const mockText = 'Love is a complex emotion.';
    (generateText as jest.Mock).mockResolvedValue({ text: mockText });

    // Call the function
    const result = await generateQuestion();

    // Assert the result
    expect(result).toBe(mockText);

    // Verify that generateText was called with the correct arguments
    expect(generateText).toHaveBeenCalledWith({
      model: expect.any(Function),
      prompt: 'What is love?',
    });
  });

  it('should handle errors', async () => {
    // Mock an error response
    const mockError = new Error('API error');
    (generateText as jest.Mock).mockRejectedValue(mockError);

    // Call the function and expect it to throw
    await expect(generateQuestion()).rejects.toThrow('API error');
  });
});
