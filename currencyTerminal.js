const axios = require('axios')

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(`http://api.currencylayer.com/live?access_key=477441e8e4bdddfc7e78d3076dbbc1cf&currencies=${fromCurrency},${toCurrency}&format=1`);

    const rate = response.data.quotes;
    const euro = 1 / rate[`USD${fromCurrency}`];
    const exchangeRate = euro * rate[`USD${toCurrency}`];
    
    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and  ${toCurrency}`);
  }  
}

const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    
    return response.data.map(country => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const countries = await getCountries(toCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(2);
  
  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;

}

convertCurrency('USD', 'EUR', 1)
  .then((message) => {
    console.log(message);
  }).catch((error) => {
    console.log(error.message);
  });

