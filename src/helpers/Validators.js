import isValid from 'date-fns/is_valid';
import isBefore from 'date-fns/is_before';
export const isValidCPF = (cpf) => {
  let sum;
  let remainder;

  sum = 0;
  if (cpf === '00000000000') return false;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(10, 11), 10)) {
    return false;
  }
  return true;
};

export const isValidDate = (date) => {    
  const parts = date.split('/');
  const utc = `${parts[2]}-${parts[1]}-${parts[0]}`;  
  const dateObj = new Date(utc);
  return (isValid(dateObj) && isBefore(dateObj, new Date()));
};
