const MAX = 5;
var entries = {};

const Types = {
  SEARCHES: 'searches',
  RESULTS: 'results',
};

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
    return getEntriesOfType(Types.SEARCHES).slice(0, MAX);
  },

  getResults: function(query) {
    return (getEntriesOfType(Types.RESULTS)[query] || []).slice(0);
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