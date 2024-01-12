import axios from 'axios';

export const saveData = async (jsonData: object) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/save-data', jsonData);
    console.log(response.data);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};