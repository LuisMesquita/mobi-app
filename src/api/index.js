import axios from 'axios';
import qs from 'qs';
import store from '../store';
import Constants from '../constants/Constants';
import { showBlockingWarning } from '../helpers/ErrorHandler';

const mappedErrorCodes = [503, 505, 401, 412, 403, 404];

export const request = (endPoint, method = 'post', data, headers = {}) => {  
  const string = typeof data === 'object' ? qs.stringify(data) : data
  url = `${Constants.SERVER_URL}${endPoint}?${qs.stringify({
    hashApp: Constants.HASH_APP,
    currentVersionApp: Constants.CURRENT_VERSION_APP    
  })}&${string}`  
  
  return axios({
    method,
    url: url  
  })
  .then(response => {
    const httpStatus = response.data.HttpStatus
    
    if (mappedErrorCodes.includes(httpStatus)) {
      // App or user blocked
      console.log('error data', response.data)
      showBlockingWarning(response.data);
      return
    }    

    return response    
  })
  .catch(error => {   
      console.log(error)         
      console.log(url)
      const errorStatus = error.response.status      
      if (mappedErrorCodes.includes(errorStatus)) {
        // App or user blocked
        showBlockingWarning(error.response.data);
        return;
      }
      
      if (errorStatus === 418) {
        // Missing CPF        
        // requestCPF();
        return;
      }

      throw error;
    });
};
