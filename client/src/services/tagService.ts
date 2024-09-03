import { REACT_APP_API_URL, api } from './config';

const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

/**
 * Function to get tags with the number of associated questions.
 * 
 * @throws Error if there is an issue fetching tags with the question number.
 */
const getTagsWithQuestionNumber = async (): Promise<any> => {
  try {
    const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`);
    if (res.status !== 200) {
      throw new Error('Error when fetching tags with question number');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to get a tag by its name.
 * 
 * @param name - The name of the tag to retrieve.
 * @throws Error if there is an issue fetching the tag by name.
 */
const getTagByName = async (name: string): Promise<any> => {
  try {
    const res = await api.get(`${TAG_API_URL}/getTagByName/${name}`);
    if (res.status !== 200) {
      throw new Error(`Error when fetching tag: ${name}`);
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { getTagsWithQuestionNumber, getTagByName };
