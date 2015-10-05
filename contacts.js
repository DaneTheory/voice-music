anonymous = 'stranger';
contacts = {
  '+15303129527': 'Mouad Debbar',
  '+15108579266': 'Ourida Serouti',
};

module.exports = {
  getName: function(number) {
    return contacts[number] || anonymous;
  },

  isAnonymous: function(number) {
    return number in contacts;
  },
};
