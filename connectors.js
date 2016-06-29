/*
    List of ad ldap connectors to be monitored
    Timeouts are in minutes.
*/
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
