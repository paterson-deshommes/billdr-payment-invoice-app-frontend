# billdr-payment-invoice-app-frontend# Project Title

## Table of Contents
+ [About](#about)
+ [Getting Started](#getting_started)
+ [Usage](#usage)
+ [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>
Frontend code for the multi-payment invoice app.

## Getting Started <a name = "getting_started"></a>

### Prerequisites

1. Sign up/Sign in to Stripe and create an account.
2. Install [NodeJS](https://nodejs.org/en/download/).


### Installing

From the payment-invoice-frontend folder, run
```
npm install
```

Create a new .env.local file and put the following environment variables
```
DJANGO_USER=<username>                    --- username of a user set in the backend api (server component)
DJANGO_PASS=<password>                    --- password of a user set in the backend api (server component)
API_URL=<some-url>                        --- url of your api (e.g: http://localhost:3000/ for local dev) (server component)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<pk>   --- get publishable key from your stripe dashbaord
NEXT_PUBLIC_PAYMENT_RETURN_URL=<some-url> --- return url a fter a payment is processed
NEXT_PUBLIC_DJANGO_USER=<username>        --- username of user set in the backend api (client component)
NEXT_PUBLIC_DJANGO_PASS=<password>        --- password of a user set in the backend api (client component)
NEXT_PUBLIC_API_URL=<some-url>            --- url of your api (e.g: http://localhost:3000/ for local development) (client component)
```

To run server, use the command
```
npm run dev
```

Make sure the [backend api](https://github.com/paterson-deshommes/billdr-paymeent-invoice-app-backend) is up and running before. 