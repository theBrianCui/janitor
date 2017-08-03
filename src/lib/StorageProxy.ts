declare var browser: any;

const DOMAIN_PREFIX = "DOMAIN:";
const SETTINGS_PREFIX = "SETTINGS:";

interface DomainStorage {
    [key: string]: Array<string>;
}

const StorageProxy = {
    // Returns an array of all the queries for a given domain.
    getQueriesForDomain: function(domain: string): Promise<Array<string>> {
        let key = DOMAIN_PREFIX + domain;
        console.log("the key: " + key);
        return browser.storage.sync.get(key).then((result: DomainStorage) => { 
            console.log(result);
            return result[key] || []; 
        });
    },

    // Assigns the list of queries for a given domain. 
    setQueriesForDomain: function(domain: string, queries: Array<string>): Promise<Array<string>> {
        console.log("setQueriesForDomain was called: " + domain + ", " + queries);

        let key = DOMAIN_PREFIX + domain;
        let newQueries: DomainStorage = {};
        newQueries[key] = queries;

        return browser.storage.sync.set(newQueries).then(() => {
            return this.getQueriesForDomain(domain);
        });
    },

    // Appends a query to a domain's query list and then returns the new list.
    addQueryForDomain: function(domain: string, query: string): Promise<Array<string>> {

        console.log("addQueryForDomain was called: " + domain + ", " + query);
        return this.getQueriesForDomain(domain)
            .then((queries: Array<string>) => {

                queries = queries || [];
                if (query && queries.indexOf(query) < 0)
                    queries.push(query);

                console.log("AQFD: pushing query and returning " + queries);
                return queries;
            }).then((newQueries: Array<string>) => {
                console.log("AQFD: setting query " + newQueries);
                return this.setQueriesForDomain(domain, newQueries);
            });
    },
};

export default StorageProxy;