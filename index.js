import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import inquirer from "inquirer";
import chalk from "chalk";


const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CNY",
  "INR",
  "AUD",
  "CAD",
  "CHF",
  "NZD",
  "SEK",
  "NOK",
  "DKK",
  "RUB",
  "BRL",
  "ZAR",
  "MXN",
  "SGD",
  "HKD",
  "KRW",
  "TRY",
  "AED",
  "SAR",
  "MYR",
  "THB",
  "IDR",
  "PHP",
  "PLN",
  "CZK",
  "HUF",
  "ILS",
  "EGP",
  "PKR",
  "BDT",
  "VND",
  "NGN",
  "ARS",
  "CLP",
  "COP",
  "KZT",
];

const questions = [
  {
    type: "list",
    name: "from",
    message: "Convert from",
    choices: currencies,
  },
  {
    type: "list",
    name: "to",
    message: "Convert To",
    choices: currencies,
  },
  {
    type: "number",
    name: "amount",
    message: "Amount to Convert",
    validate: (value) => {
      if (!isNaN(value) && value > 0) return true;
      return "Please enter a valid positive number.";
    },
  },
];

const convertCurrency = async (from, to, amount) => {
  try {
    if (from === to) return amount.toFixed(2);

    const API_KEY = process.env.API_KEY;

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`
    );

    // Check for successful response
    if (response.data.result === "success") {
      return response.data.conversion_result.toFixed(2);
    } else {
      throw new Error(response.data.error || "Conversion failed");
    }
  } catch (error) {
    console.error(chalk.red("Error fetching conversion rate:"), error.message);
    return null;
  }
};

const run = async () => {
  console.log(chalk.blue.bold("💱💰 Currency Converter"));
  const answers = await inquirer.prompt(questions);
  const { from, to, amount } = answers;

  console.log(chalk.yellow(`Converting ${amount} ${from} to ${to}...`));
  const convertedAmount = await convertCurrency(from, to, amount);

  if (convertedAmount !== null) {
    console.log(
      `${amount} ${chalk.green(from)} = ${chalk.green(
        convertedAmount
      )} ${chalk.green(to)}`
    );
  } else {
    console.log(chalk.red("Conversion failed."));
  }

  const { again } = await inquirer.prompt({
    type: "confirm",
    name: "again",
    message: "Do you want to convert another currency?",
  });

  if (again) await run();
  else console.log(chalk.blue("Thank you for using Currency Converter!"));
};

run();
