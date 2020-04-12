var fromCurrency = document.querySelector("#fromCurrency");
var toCurrency = document.querySelector("#toCurrency");
var amount = document.querySelector("#amount");
var convertBtn = document.querySelector("#convertBtn");

//Exchange rate API call => http://currencylayer.com
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const link = `https://cors-anywhere.herokuapp.com/http://api.currencylayer.com/live?access_key=477441e8e4bdddfc7e78d3076dbbc1cf&currencies=${fromCurrency},${toCurrency}&format=1`;

    const response = await axios.get(link);

    const rate = response.data.quotes;
    const euro = 1 / rate[`USD${fromCurrency}`];
    const exchangeRate = euro * rate[`USD${toCurrency}`];

    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and  ${toCurrency}`);
  }
};

//Get countried API call => https://restcountries.eu
const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(
      `https://restcountries.eu/rest/v2/currency/${currencyCode}`
    );
    return response.data.map((country) => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};


const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const countriesTo = await getCountries(toCurrency);
  const countriesFrom = await getCountries(fromCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(2);

  const message = [
    `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.`,
    countriesTo, countriesFrom
  ];
  return message;
};

//Convert function on click event
function convert() {
  let amt = amount.value;
  let from = fromCurrency.value;
  let to = toCurrency.value;

  let summary = document.querySelector(".summary");
  let result = document.querySelector("#result");
  let countriesTo = document.querySelector("#countriesTo");
  let countriesFrom = document.querySelector("#countriesFrom");
  let loading = document.querySelector("#loading");


  if (amt && from && to) {

    loading.style.display = "inherit"
    document.getElementById("error").style.visibility = "hidden";
    document.querySelector('.countries').style.display = "inherit";

    convertCurrency(from.toUpperCase(), to.toUpperCase(), amt)
      .then((message) => {
        loading.style.display = 'none'
        summary.style.display = "inherit";
        result.textContent = message[0];
        let countries1 = message[1];
        let countries2 = message[2];

        if (countriesTo.hasChildNodes()) {
          var first = countriesTo.firstElementChild; 
          while (first) { 
              first.remove(); 
              first = countriesTo.firstElementChild; 
          } 
        }
        if (countriesFrom.hasChildNodes()) {
          var first = countriesFrom.firstElementChild; 
          while (first) { 
              first.remove(); 
              first = countriesFrom.firstElementChild; 
          } 
        }

        //Countries using currency to
        var listContainer1 = document.createElement("ul");
        countries1.forEach((c) => {
          var node = document.createElement("li");
          var textnode = document.createTextNode(c);
          node.appendChild(textnode);
          listContainer1.appendChild(node);
        });
        let p1 = document.createElement('p')
        let text1 = `You can spend ${to.toUpperCase()} in the following countries :`
        text1 = document.createTextNode(text1)
        p1.appendChild(text1)
        countriesTo.appendChild(p1)
        countriesTo.appendChild(listContainer1);

        //Countries using currency from
        var listContainer2 = document.createElement("ul");
        countries2.forEach((c) => {
          var node = document.createElement("li");
          var textnode = document.createTextNode(c);
          node.appendChild(textnode);
          listContainer2.appendChild(node);
        });
        let p2 = document.createElement('p')
        let text2 = `You can spend ${from.toUpperCase()} in the following countries :`
        text2 = document.createTextNode(text2)
        p2.appendChild(text2)
        countriesFrom.appendChild(p2)
        countriesFrom.appendChild(listContainer2);

      })
      .catch((error) => {
        loading.style.display = 'none'
        summary.style.display = "inherit";
        document.querySelector('.countries').style.display = "none";
        document.getElementById("error").style.visibility = "hidden";

        result.textContent = error.message;
        console.log(error.message);
      });
  } 
  else {
    document.getElementById("error").style.visibility = "inherit";
  }
}

convertBtn.addEventListener("click", convert);
