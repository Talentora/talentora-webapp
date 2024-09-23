import axios from 'axios';

export async function getAllMeetings() {
    try {
      const key = process.env.NEXT_PUBLIC_DAILY_API_KEY;
      const res = await axios.get(
        'https://api.daily.co/v1/meetings',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
        }
      );
      console.log('Status:', res.status);
  
      // Ensure the response is always an array
      return res.data;
    } catch (error: any) {
      console.error('Error fetching meetings:', error.response?.data || error.message);
      return []; // Return an empty array in case of an error
    }
  }
  

export async function getMeeting(id:string) {
    try {
        const key = process.env.NEXT_PUBLIC_DAILY_API_KEY;
        const res = await axios.get(
          `https://api.daily.co/v1/meetings/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${key}`,
            },
          }
        );
        console.log('Status:', res.status);
    
        // Ensure the response is always an array
        return res.data;
      } catch (error: any) {
        console.error('Error fetching meeting:', error.response?.data || error.message);
        return null; // Return an empty array in case of an error
      }
}

export async function getSession(id:string) {
  try {
      const key = process.env.NEXT_PUBLIC_DAILY_API_KEY;
      const res = await axios.get(
        `https://api.daily.co/v1/meetings/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
        }
      );
      console.log('Status:', res.status);
  
      // Ensure the response is always an array
      return res.data;
    } catch (error: any) {
      console.error('Error fetching meeting:', error.response?.data || error.message);
      return null; // Return an empty array in case of an error
    }
}