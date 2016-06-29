# Auth0 AD/LDAP Connector Monitor

Small tool to monitor the health of your Auth0 AD/LDAP Connector.
Whenever the ad-ldap-connector is down, this tool will notify the person configured in the
`to_email_address`.
## Configuration

In the `config.json` file, set the following values:

### Auth0 Credentials
 - `auth0_domain`: Your Auth0 account.
 - `auth0_global_client_id`: Your Global Client Id
 - `auth0_global_client_secret`: Your Global Client Secret

 ### Email Credentials
 - `from_email_address`: From Email address
 - `to_email_address`: To Email address. This can be an Array of addresses E.g ["teast@example.com", "test2@example.com"]
 - `api_key`: Sendgrid API Key

> You can get your Global Client Id/Secret your Auth0 Dashboard under Account Settings Advance Tab
> You can create a Sendgrid API key here: https://sendgrid.com/
### connectors

- Open the connectors.js file
- You can add in a array of connectors, example
```
module.exports = [
    {
        name: 'OpenLDAPUbuntu',
        timeout: 1
    },

    {
        name: 'OpenLDAP',
        timeout: 2
    }
];
```
- `name`: The name of the connector configured in your Auth0 dashboard
- `timeout`: How frequently you want to monitor your connection. The `timeout` is in `minutes`

## Running the tool

 1. Install Node.js 4.0 or higher: https://nodejs.org/en/download/
 2. Clone/Download this repository
 3. Run `node app` from the repository's directory
