const MAX_SEARCHES = 5;
const MAX_RESULTS = 5;

const Types = {
  SEARCHES: 'searches',
  RESULTS: 'results',
};

var entries = {};

function getEntriesOfType(type) {
  entries[type] = entries[type] || [];
  return entries[type];
}

module.exports = {
  addSearch: function(query) {
    getEntriesOfType(Types.SEARCHES).unshift(query);
    return this;
  },

  addResults: function(query, results) {
    var entries = getEntriesOfType(Types.RESULTS);
    entries[query] = results;
    return this;
  },

  getSearches: function() {
    return getEntriesOfType(Types.SEARCHES).slice(0, MAX_SEARCHES);
  },

  getResults: function(query) {
    return (getEntriesOfType(Types.RESULTS)[query] || []).slice(0, MAX_RESULTS);
  },

  clear: function(type) {
    if (type) {
      entries[type] = [];
    } else {
      entries = {};
    }
    return this;
  }
};
