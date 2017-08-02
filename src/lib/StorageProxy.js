const DOMAIN_PREFIX = "DOMAIN:";
const SETTINGS_PREFIX = "SETTINGS:";

export default Storage = {
    // Returns an array of all the queries for a given domain.
    getQueriesForDomain: function(domain) {
        let key = DOMAIN_PREFIX + domain;
        console.log("the key: " + key);
        return browser.storage.sync.get(key).then((result) => { 
            console.log(result);
            return result[key] || []; 
        });
    },

    // Assigns the list of queries for a given domain. 
    setQueriesForDomain: function(domain, queries) {
        console.log("setQueriesForDomain was called: " + domain + ", " + queries);

        if (!Array.isArray(queries)) {
            throw new Error("Queries for domain must be assigned to an array.");
        }

        let key = DOMAIN_PREFIX + domain;
        let newQueries = {};
        newQueries[key] = queries;

        return browser.storage.sync.set(newQueries).then(() => {
            return this.getQueriesForDomain(domain);
        });
    },

    // Appends a query to a domain's query list and then returns the new list.
    addQueryForDomain: function(domain, query) {

        console.log("addQueryForDomain was called: " + domain + ", " + query);
        return this.getQueriesForDomain(domain)
            .then((queries) => {

                queries = queries || [];
                if (query && queries.indexOf(query) < 0)
                    queries.push(query);

                console.log("AQFD: pushing query and returning " + queries);
                return queries;
            }).then((newQueries) => {
                console.log("AQFD: setting query " + newQueries);
                return this.setQueriesForDomain(domain, newQueries);
            });
    },
};