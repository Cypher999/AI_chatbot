import axios from 'axios';
export async function get(url) {
  try {
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data
  }
}

export async function post(url, formData) {
  try {
    const response = await axios.post(url, formData,{
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data
  }
}

export async function put(url, formData) {
  try {
    
    if(formData===null){
      formData=new FormData()
    }
    
    const response = await axios.put(url, formData,{
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data
  }
}

export async function del(url) {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    return error.response.data
  }
}
